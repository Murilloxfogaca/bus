using FluentAssertions;
using Moq;
using OnibusExpress.Application.DTOs;
using OnibusExpress.Application.Interfaces;
using OnibusExpress.Application.Services;
using OnibusExpress.Domain.Entities;
using OnibusExpress.Domain.Enums;
using OnibusExpress.Domain.Exceptions;
using Xunit;

namespace OnibusExpress.Tests;

public class ReservaServiceTests
{
    private readonly Mock<IViagemRepository>  _viagemRepo  = new();
    private readonly Mock<IReservaRepository> _reservaRepo = new();
    private readonly ReservaService _service;

    public ReservaServiceTests() =>
        _service = new ReservaService(_viagemRepo.Object, _reservaRepo.Object);

    private static Viagem CriarViagemFutura(int id = 1) => new()
    {
        Id              = id,
        RotaId          = 1,
        Rota            = new Rota { Id = 1, Origem = "São Paulo", Destino = "Rio de Janeiro", DuracaoEstimada = TimeSpan.FromHours(6) },
        DataHoraPartida = DateTime.UtcNow.AddDays(7),
        PrecoBase       = 99.90m,
        TotalAssentos   = 40,
        Reservas        = new List<Reserva>(),
    };

    private static CriarReservaRequest CriarRequestValido() => new()
    {
        ViagemId      = 1,
        NumeroAssento = 5,
        NomeCompleto  = "João Silva",
        Cpf           = "529.982.247-25",
        Email         = "joao@email.com",
    };

    [Fact]
    public async Task CriarAsync_ComDadosValidos_RetornaReservaConfirmada()
    {
        var viagem  = CriarViagemFutura();
        var request = CriarRequestValido();

        _viagemRepo .Setup(r => r.GetByIdAsync(1)).ReturnsAsync(viagem);
        _reservaRepo.Setup(r => r.IsAssentoOcupadoAsync(1, 5)).ReturnsAsync(false);
        _reservaRepo.Setup(r => r.ExistsCodigoAsync(It.IsAny<string>())).ReturnsAsync(false);
        _reservaRepo.Setup(r => r.CreateAsync(It.IsAny<Passageiro>(), It.IsAny<Reserva>()))
            .ReturnsAsync((Passageiro p, Reserva r) =>
            {
                r.Passageiro = p;
                r.Viagem     = viagem;
                return r;
            });

        var result = await _service.CriarAsync(request);

        result.Should().NotBeNull();
        result.NumeroAssento.Should().Be(5);
        result.Status.Should().Be("confirmada");
        result.CodigoReserva.Should().MatchRegex(@"^[A-Z]{3}-\d{5}$");
    }

    [Fact]
    public async Task CriarAsync_ComCpfInvalido_LancaDomainException()
    {
        var request = new CriarReservaRequest
        {
            ViagemId = 1, NumeroAssento = 5, NomeCompleto = "João Silva",
            Cpf = "123.456.789-00", Email = "joao@email.com",
        };

        await _service.Invoking(s => s.CriarAsync(request))
            .Should().ThrowAsync<DomainException>()
            .WithMessage("*CPF*");
    }

    [Fact]
    public async Task CriarAsync_ComViagemJaRealizada_LancaDomainException()
    {
        var viagem = CriarViagemFutura();
        viagem.DataHoraPartida = DateTime.UtcNow.AddHours(-1);

        _viagemRepo .Setup(r => r.GetByIdAsync(1)).ReturnsAsync(viagem);
        _reservaRepo.Setup(r => r.IsAssentoOcupadoAsync(1, 5)).ReturnsAsync(false);
        _reservaRepo.Setup(r => r.ExistsCodigoAsync(It.IsAny<string>())).ReturnsAsync(false);

        await _service.Invoking(s => s.CriarAsync(CriarRequestValido()))
            .Should().ThrowAsync<DomainException>()
            .WithMessage("*já realizada*");
    }

    [Fact]
    public async Task CriarAsync_ComAssentoOcupado_LancaDomainException()
    {
        _viagemRepo .Setup(r => r.GetByIdAsync(1)).ReturnsAsync(CriarViagemFutura());
        _reservaRepo.Setup(r => r.IsAssentoOcupadoAsync(1, 5)).ReturnsAsync(true);

        await _service.Invoking(s => s.CriarAsync(CriarRequestValido()))
            .Should().ThrowAsync<DomainException>()
            .WithMessage("*ocupado*");
    }

    [Fact]
    public async Task CancelarAsync_DentroDoPrazo_CancelaReserva()
    {
        var reserva = new Reserva
        {
            Id            = 1,
            CodigoReserva = "ABC-12345",
            NumeroAssento = 5,
            Viagem        = CriarViagemFutura(),
        };

        _reservaRepo.Setup(r => r.GetByCodigoAsync("ABC-12345")).ReturnsAsync(reserva);
        _reservaRepo.Setup(r => r.UpdateAsync(It.IsAny<Reserva>())).Returns(Task.CompletedTask);

        await _service.CancelarAsync("ABC-12345");

        reserva.Status.Should().Be(ReservaStatus.Cancelada);
    }

    [Fact]
    public async Task CancelarAsync_MenosDe2HorasParaPartida_LancaDomainException()
    {
        var viagem = CriarViagemFutura();
        viagem.DataHoraPartida = DateTime.UtcNow.AddMinutes(90);

        var reserva = new Reserva
        {
            Id            = 1,
            CodigoReserva = "XYZ-99999",
            NumeroAssento = 10,
            Viagem        = viagem,
        };

        _reservaRepo.Setup(r => r.GetByCodigoAsync("XYZ-99999")).ReturnsAsync(reserva);

        await _service.Invoking(s => s.CancelarAsync("XYZ-99999"))
            .Should().ThrowAsync<DomainException>()
            .WithMessage("*menos de 2 horas*");
    }

    [Fact]
    public async Task CancelarAsync_ReservaJaCancelada_LancaDomainException()
    {
        var reserva = new Reserva
        {
            Id            = 1,
            CodigoReserva = "DEF-11111",
            Viagem        = CriarViagemFutura(),
        };
        reserva.Cancelar();

        _reservaRepo.Setup(r => r.GetByCodigoAsync("DEF-11111")).ReturnsAsync(reserva);

        await _service.Invoking(s => s.CancelarAsync("DEF-11111"))
            .Should().ThrowAsync<DomainException>()
            .WithMessage("*já está cancelada*");
    }
}
