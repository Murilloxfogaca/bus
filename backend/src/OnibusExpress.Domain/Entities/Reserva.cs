using OnibusExpress.Domain.Enums;

namespace OnibusExpress.Domain.Entities;

public class Reserva
{
    public int Id { get; set; }
    public int ViagemId { get; set; }
    public Viagem Viagem { get; set; } = null!;
    public int PassageiroId { get; set; }
    public Passageiro Passageiro { get; set; } = null!;
    public int NumeroAssento { get; set; }
    public ReservaStatus Status { get; private set; } = ReservaStatus.Confirmada;
    public string CodigoReserva { get; set; } = string.Empty;
    public DateTime CriadaEm { get; set; } = DateTime.UtcNow;

    public void Cancelar() => Status = ReservaStatus.Cancelada;
}
