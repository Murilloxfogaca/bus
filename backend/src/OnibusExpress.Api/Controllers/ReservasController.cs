using Microsoft.AspNetCore.Mvc;
using OnibusExpress.Application.DTOs;
using OnibusExpress.Application.Services;

namespace OnibusExpress.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReservasController : ControllerBase
{
    private readonly ReservaService _service;

    public ReservasController(ReservaService service) => _service = service;

    [HttpPost]
    public async Task<ActionResult<ReservaDto>> Create([FromBody] CriarReservaRequest request)
    {
        var reserva = await _service.CriarAsync(request);
        return CreatedAtAction(nameof(GetByCodigo), new { codigo = reserva.CodigoReserva }, reserva);
    }

    [HttpGet("{codigo}")]
    public async Task<ActionResult<ReservaDto>> GetByCodigo(string codigo)
    {
        var reserva = await _service.ObterPorCodigoAsync(codigo);
        if (reserva == null) return NotFound(new { error = "Reserva não encontrada." });
        return Ok(reserva);
    }

    [HttpDelete("{codigo}")]
    public async Task<IActionResult> Delete(string codigo)
    {
        await _service.CancelarAsync(codigo);
        return NoContent();
    }
}
