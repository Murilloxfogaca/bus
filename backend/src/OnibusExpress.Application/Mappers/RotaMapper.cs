using OnibusExpress.Application.DTOs;
using OnibusExpress.Domain.Entities;

namespace OnibusExpress.Application.Mappers;

internal static class RotaMapper
{
    internal static RotaDto ToDto(Rota rota) => new()
    {
        Id              = rota.Id,
        Origem          = rota.Origem,
        Destino         = rota.Destino,
        DuracaoEstimada = FormatDuracao(rota.DuracaoEstimada),
    };

    private static string FormatDuracao(TimeSpan ts)
    {
        var h = (int)ts.TotalHours;
        return ts.Minutes == 0 ? $"{h}h" : $"{h}h {ts.Minutes}m";
    }
}
