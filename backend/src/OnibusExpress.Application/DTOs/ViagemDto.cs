namespace OnibusExpress.Application.DTOs;

public class ViagemDto
{
    public int Id { get; set; }
    public RotaDto Rota { get; set; } = null!;
    public DateTime DataHoraPartida { get; set; }
    public decimal PrecoBase { get; set; }
    public int AssentosDisponiveis { get; set; }
    public int TotalAssentos { get; set; }
}
