using Microsoft.AspNetCore.Mvc;
using OnibusExpress.Application.DTOs;
using OnibusExpress.Application.Services;

namespace OnibusExpress.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ViagensController : ControllerBase
{
    private readonly ViagemService _service;

    public ViagensController(ViagemService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ViagemDto>>> Get(
        [FromQuery] string origem,
        [FromQuery] string destino,
        [FromQuery] string data)
    {
        if (string.IsNullOrWhiteSpace(origem) || string.IsNullOrWhiteSpace(destino) || string.IsNullOrWhiteSpace(data))
            return BadRequest(new { error = "Os parâmetros origem, destino e data são obrigatórios." });

        var viagens = await _service.BuscarAsync(origem, destino, data);
        return Ok(viagens);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ViagemDetalhesDto>> GetById(int id)
    {
        var viagem = await _service.ObterDetalhesAsync(id);
        if (viagem == null) return NotFound(new { error = "Viagem não encontrada." });
        return Ok(viagem);
    }
}
