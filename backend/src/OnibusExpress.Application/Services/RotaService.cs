using OnibusExpress.Application.DTOs;
using OnibusExpress.Application.Interfaces;
using OnibusExpress.Application.Mappers;

namespace OnibusExpress.Application.Services;

public class RotaService
{
    private readonly IRotaRepository _repo;

    public RotaService(IRotaRepository repo) => _repo = repo;

    public async Task<IEnumerable<RotaDto>> ListarAsync()
    {
        var rotas = await _repo.GetAllAsync();
        return rotas.Select(RotaMapper.ToDto);
    }
}
