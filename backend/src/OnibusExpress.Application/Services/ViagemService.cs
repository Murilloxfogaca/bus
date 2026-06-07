using OnibusExpress.Application.DTOs;
using OnibusExpress.Application.Interfaces;
using OnibusExpress.Application.Mappers;
using OnibusExpress.Domain.Entities;
using OnibusExpress.Domain.Enums;

namespace OnibusExpress.Application.Services;

public class ViagemService
{
    private readonly IViagemRepository _repo;

    public ViagemService(IViagemRepository repo) => _repo = repo;

    public async Task<IEnumerable<ViagemDto>> BuscarAsync(string origem, string destino, string data)
    {
        if (!DateOnly.TryParse(data, out var date))
            throw new ArgumentException("Data inválida. Use o formato YYYY-MM-DD.");

        var viagens = await _repo.BuscarAsync(origem, destino, date);
        return viagens.Select(MapToDto);
    }

    public async Task<ViagemDetalhesDto?> ObterDetalhesAsync(int id)
    {
        var viagem = await _repo.GetByIdComAssentosAsync(id);
        return viagem == null ? null : MapToDetalhesDto(viagem);
    }

    internal static ViagemDto MapToDto(Viagem v) => new()
    {
        Id                  = v.Id,
        Rota                = RotaMapper.ToDto(v.Rota),
        DataHoraPartida     = v.DataHoraPartida,
        PrecoBase           = v.PrecoBase,
        AssentosDisponiveis = v.AssentosDisponiveis,
        TotalAssentos       = v.TotalAssentos,
    };

    private static ViagemDetalhesDto MapToDetalhesDto(Viagem v)
    {
        var assentosOcupados = v.Reservas
            .Where(r => r.Status == ReservaStatus.Confirmada)
            .Select(r => r.NumeroAssento)
            .ToHashSet();

        return new ViagemDetalhesDto
        {
            Id                  = v.Id,
            Rota                = RotaMapper.ToDto(v.Rota),
            DataHoraPartida     = v.DataHoraPartida,
            PrecoBase           = v.PrecoBase,
            AssentosDisponiveis = v.AssentosDisponiveis,
            TotalAssentos       = v.TotalAssentos,
            Assentos            = Enumerable.Range(1, v.TotalAssentos)
                .Select(n => new AssentoDto { Numero = n, Ocupado = assentosOcupados.Contains(n) })
                .ToList(),
        };
    }
}
