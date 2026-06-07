using OnibusExpress.Domain.Enums;

namespace OnibusExpress.Domain.Entities;

public class Viagem
{
    public int Id { get; set; }
    public int RotaId { get; set; }
    public Rota Rota { get; set; } = null!;
    public DateTime DataHoraPartida { get; set; }
    public decimal PrecoBase { get; set; }
    public int TotalAssentos { get; set; }
    public List<Reserva> Reservas { get; set; } = new();

    public int AssentosDisponiveis =>
        TotalAssentos - Reservas.Count(r => r.Status == ReservaStatus.Confirmada);
}
