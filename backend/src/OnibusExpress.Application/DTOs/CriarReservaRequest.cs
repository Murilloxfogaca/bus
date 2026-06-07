using System.ComponentModel.DataAnnotations;

namespace OnibusExpress.Application.DTOs;

public class CriarReservaRequest
{
    [Required]
    public int ViagemId { get; set; }

    [Required, Range(1, int.MaxValue)]
    public int NumeroAssento { get; set; }

    [Required, MaxLength(200)]
    public string NomeCompleto { get; set; } = string.Empty;

    [Required]
    public string Cpf { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;
}
