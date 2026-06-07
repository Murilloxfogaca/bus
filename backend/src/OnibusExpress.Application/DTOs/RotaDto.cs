namespace OnibusExpress.Application.DTOs;

public class RotaDto
{
    public int Id { get; set; }
    public string Origem { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public string DuracaoEstimada { get; set; } = string.Empty;
}
