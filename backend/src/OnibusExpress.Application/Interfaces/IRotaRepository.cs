using OnibusExpress.Domain.Entities;

namespace OnibusExpress.Application.Interfaces;

public interface IRotaRepository
{
    Task<IEnumerable<Rota>> GetAllAsync();
}
