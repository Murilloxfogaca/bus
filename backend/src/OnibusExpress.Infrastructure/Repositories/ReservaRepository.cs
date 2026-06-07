using Microsoft.EntityFrameworkCore;
using OnibusExpress.Application.Interfaces;
using OnibusExpress.Domain.Entities;
using OnibusExpress.Domain.Enums;
using OnibusExpress.Infrastructure.Data;

namespace OnibusExpress.Infrastructure.Repositories;

public class ReservaRepository : IReservaRepository
{
    private readonly AppDbContext _context;

    public ReservaRepository(AppDbContext context) => _context = context;

    public async Task<Reserva?> GetByCodigoAsync(string codigo) =>
        await _context.Reservas
            .Include(r => r.Passageiro)
            .Include(r => r.Viagem).ThenInclude(v => v.Rota)
            .Include(r => r.Viagem).ThenInclude(v => v.Reservas)
            .FirstOrDefaultAsync(r => r.CodigoReserva == codigo);

    public async Task<bool> IsAssentoOcupadoAsync(int viagemId, int numeroAssento) =>
        await _context.Reservas.AnyAsync(r =>
            r.ViagemId      == viagemId      &&
            r.NumeroAssento == numeroAssento &&
            r.Status        == ReservaStatus.Confirmada);

    public async Task<bool> ExistsCodigoAsync(string codigo) =>
        await _context.Reservas.AnyAsync(r => r.CodigoReserva == codigo);

    public async Task<Reserva> CreateAsync(Passageiro passageiro, Reserva reserva)
    {
        await using var tx = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Passageiros.Add(passageiro);
            await _context.SaveChangesAsync();

            reserva.PassageiroId = passageiro.Id;
            reserva.Passageiro   = passageiro;
            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();

            await tx.CommitAsync();
            return reserva;
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task UpdateAsync(Reserva reserva)
    {
        _context.Reservas.Update(reserva);
        await _context.SaveChangesAsync();
    }
}
