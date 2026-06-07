using OnibusExpress.Domain.Entities;

namespace OnibusExpress.Application.Interfaces;

public interface IViagemRepository
{
    Task<IEnumerable<Viagem>> BuscarAsync(string origem, string destino, DateOnly data);
    Task<Viagem?> GetByIdAsync(int id);
    Task<Viagem?> GetByIdComAssentosAsync(int id);
}
