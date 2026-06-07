using OnibusExpress.Domain.Entities;

namespace OnibusExpress.Application.Interfaces;

public interface IReservaRepository
{
    Task<Reserva?> GetByCodigoAsync(string codigo);
    Task<bool> IsAssentoOcupadoAsync(int viagemId, int numeroAssento);
    Task<bool> ExistsCodigoAsync(string codigo);
    Task<Reserva> CreateAsync(Passageiro passageiro, Reserva reserva);
    Task UpdateAsync(Reserva reserva);
}
