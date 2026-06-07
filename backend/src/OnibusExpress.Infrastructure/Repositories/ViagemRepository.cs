using Microsoft.EntityFrameworkCore;
using OnibusExpress.Application.Interfaces;
using OnibusExpress.Domain.Entities;
using OnibusExpress.Infrastructure.Data;

namespace OnibusExpress.Infrastructure.Repositories;

public class ViagemRepository : IViagemRepository
{
    private readonly AppDbContext _context;

    public ViagemRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Viagem>> BuscarAsync(string origem, string destino, DateOnly data)
    {
        var inicio  = data.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var proximo = data.AddDays(1).ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);

        return await _context.Viagens
            .Include(v => v.Rota)
            .Include(v => v.Reservas)
            .Where(v =>
                v.Rota.Origem  == origem  &&
                v.Rota.Destino == destino &&
                v.DataHoraPartida >= inicio  &&
                v.DataHoraPartida <  proximo &&
                v.DataHoraPartida >  DateTime.UtcNow)
            .OrderBy(v => v.DataHoraPartida)
            .ToListAsync();
    }

    public async Task<Viagem?> GetByIdAsync(int id) =>
        await _context.Viagens
            .Include(v => v.Rota)
            .FirstOrDefaultAsync(v => v.Id == id);

    public async Task<Viagem?> GetByIdComAssentosAsync(int id) =>
        await _context.Viagens
            .Include(v => v.Rota)
            .Include(v => v.Reservas)
            .FirstOrDefaultAsync(v => v.Id == id);
}
