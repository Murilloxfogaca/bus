using Microsoft.EntityFrameworkCore;
using OnibusExpress.Domain.Entities;

namespace OnibusExpress.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Rotas.AnyAsync()) return;

        var rotas = new List<Rota>
        {
            new() { Origem = "São Paulo",      Destino = "Rio de Janeiro", DuracaoEstimada = TimeSpan.FromHours(6) },
            new() { Origem = "Rio de Janeiro", Destino = "São Paulo",      DuracaoEstimada = TimeSpan.FromHours(6) },
            new() { Origem = "São Paulo",      Destino = "Belo Horizonte", DuracaoEstimada = TimeSpan.FromHours(8) },
            new() { Origem = "Belo Horizonte", Destino = "São Paulo",      DuracaoEstimada = TimeSpan.FromHours(8) },
            new() { Origem = "São Paulo",      Destino = "Curitiba",       DuracaoEstimada = TimeSpan.FromHours(6) },
            new() { Origem = "Curitiba",       Destino = "São Paulo",      DuracaoEstimada = TimeSpan.FromHours(6) },
        };

        context.Rotas.AddRange(rotas);
        await context.SaveChangesAsync();

        var horarios = new[] { 7, 13, 19 };
        var precos   = new[] { 89.90m, 129.90m, 69.90m };
        var viagens  = new List<Viagem>();
        var base_    = DateTime.UtcNow.Date;

        foreach (var rota in rotas)
        {
            for (var dia = 1; dia <= 30; dia++)
            {
                for (var h = 0; h < horarios.Length; h++)
                {
                    viagens.Add(new Viagem
                    {
                        RotaId          = rota.Id,
                        DataHoraPartida = base_.AddDays(dia).AddHours(horarios[h]),
                        PrecoBase       = precos[h],
                        TotalAssentos   = 40,
                    });
                }
            }
        }

        context.Viagens.AddRange(viagens);
        await context.SaveChangesAsync();
    }
}
