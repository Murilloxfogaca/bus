using Microsoft.EntityFrameworkCore;
using OnibusExpress.Application.Interfaces;
using OnibusExpress.Domain.Entities;
using OnibusExpress.Infrastructure.Data;

namespace OnibusExpress.Infrastructure.Repositories;

public class RotaRepository : IRotaRepository
{
    private readonly AppDbContext _context;

    public RotaRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Rota>> GetAllAsync() =>
        await _context.Rotas.OrderBy(r => r.Origem).ThenBy(r => r.Destino).ToListAsync();
}
