namespace OnibusExpress.Application.DTOs;

public class PassageiroDto
{
    public string NomeCompleto { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class ReservaDto
{
    public int Id { get; set; }
    public string CodigoReserva { get; set; } = string.Empty;
    public ViagemDto Viagem { get; set; } = null!;
    public PassageiroDto Passageiro { get; set; } = null!;
    public int NumeroAssento { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CriadaEm { get; set; }
}
