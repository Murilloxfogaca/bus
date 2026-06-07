namespace OnibusExpress.Application.DTOs;

public class AssentoDto
{
    public int Numero { get; set; }
    public bool Ocupado { get; set; }
}

public class ViagemDetalhesDto : ViagemDto
{
    public List<AssentoDto> Assentos { get; set; } = new();
}
