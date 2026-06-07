using Microsoft.AspNetCore.Mvc;
using OnibusExpress.Application.DTOs;
using OnibusExpress.Application.Services;

namespace OnibusExpress.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class RotasController : ControllerBase
{
    private readonly RotaService _service;

    public RotasController(RotaService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RotaDto>>> Get()
    {
        var rotas = await _service.ListarAsync();
        return Ok(rotas);
    }
}
