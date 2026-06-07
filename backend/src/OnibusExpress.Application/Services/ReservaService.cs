using OnibusExpress.Application.DTOs;
using OnibusExpress.Application.Interfaces;
using OnibusExpress.Application.Mappers;
using OnibusExpress.Domain.Entities;
using OnibusExpress.Domain.Enums;
using OnibusExpress.Domain.Exceptions;
using OnibusExpress.Domain.Services;

namespace OnibusExpress.Application.Services;

public class ReservaService
{
    private readonly IViagemRepository  _viagemRepo;
    private readonly IReservaRepository _reservaRepo;

    public ReservaService(IViagemRepository viagemRepo, IReservaRepository reservaRepo)
    {
        _viagemRepo  = viagemRepo;
        _reservaRepo = reservaRepo;
    }

    public async Task<ReservaDto> CriarAsync(CriarReservaRequest request)
    {
        if (!CpfValidator.IsValid(request.Cpf))
            throw new DomainException("CPF inválido.");

        var viagem = await _viagemRepo.GetByIdAsync(request.ViagemId)
            ?? throw new DomainException("Viagem não encontrada.");

        if (viagem.DataHoraPartida <= DateTime.UtcNow)
            throw new DomainException("Não é possível reservar passagem para uma viagem já realizada.");

        if (request.NumeroAssento < 1 || request.NumeroAssento > viagem.TotalAssentos)
            throw new DomainException($"Número de assento inválido. Deve ser entre 1 e {viagem.TotalAssentos}.");

        if (await _reservaRepo.IsAssentoOcupadoAsync(request.ViagemId, request.NumeroAssento))
            throw new DomainException("Assento já está ocupado. Escolha outro assento.");

        var codigo = await GerarCodigoUnicoAsync();

        var passageiro = new Passageiro
        {
            NomeCompleto = request.NomeCompleto,
            Cpf          = new string(request.Cpf.Where(char.IsDigit).ToArray()),
            Email        = request.Email,
        };

        var reserva = new Reserva
        {
            ViagemId      = request.ViagemId,
            NumeroAssento = request.NumeroAssento,
            CodigoReserva = codigo,
            CriadaEm      = DateTime.UtcNow,
        };

        var criada = await _reservaRepo.CreateAsync(passageiro, reserva);
        criada.Viagem = viagem;

        return MapToDto(criada);
    }

    public async Task<ReservaDto?> ObterPorCodigoAsync(string codigo)
    {
        var reserva = await _reservaRepo.GetByCodigoAsync(codigo);
        return reserva == null ? null : MapToDto(reserva);
    }

    public async Task CancelarAsync(string codigo)
    {
        var reserva = await _reservaRepo.GetByCodigoAsync(codigo)
            ?? throw new DomainException("Reserva não encontrada.");

        if (reserva.Status == ReservaStatus.Cancelada)
            throw new DomainException("Esta reserva já está cancelada.");

        var horasParaPartida = (reserva.Viagem.DataHoraPartida - DateTime.UtcNow).TotalHours;
        if (horasParaPartida < 2)
            throw new DomainException("Cancelamento não permitido. A partida ocorre em menos de 2 horas.");

        reserva.Cancelar();
        await _reservaRepo.UpdateAsync(reserva);
    }

    private async Task<string> GerarCodigoUnicoAsync()
    {
        const int maxTentativas = 10;
        for (var i = 0; i < maxTentativas; i++)
        {
            var codigo = BookingCodeGenerator.Generate();
            if (!await _reservaRepo.ExistsCodigoAsync(codigo))
                return codigo;
        }
        throw new InvalidOperationException("Não foi possível gerar um código de reserva único após várias tentativas.");
    }

    private static ReservaDto MapToDto(Reserva r) => new()
    {
        Id            = r.Id,
        CodigoReserva = r.CodigoReserva,
        Viagem        = new ViagemDto
        {
            Id                  = r.Viagem.Id,
            Rota                = RotaMapper.ToDto(r.Viagem.Rota),
            DataHoraPartida     = r.Viagem.DataHoraPartida,
            PrecoBase           = r.Viagem.PrecoBase,
            AssentosDisponiveis = r.Viagem.AssentosDisponiveis,
            TotalAssentos       = r.Viagem.TotalAssentos,
        },
        Passageiro    = new PassageiroDto
        {
            NomeCompleto = r.Passageiro.NomeCompleto,
            Cpf          = r.Passageiro.Cpf,
            Email        = r.Passageiro.Email,
        },
        NumeroAssento = r.NumeroAssento,
        Status        = r.Status == ReservaStatus.Confirmada ? "confirmada" : "cancelada",
        CriadaEm      = r.CriadaEm,
    };
}
