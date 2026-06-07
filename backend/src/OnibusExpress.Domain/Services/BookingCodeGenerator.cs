namespace OnibusExpress.Domain.Services;

public static class BookingCodeGenerator
{
    public static string Generate()
    {
        var rng = Random.Shared;
        var letters = new string(new[]
        {
            (char)('A' + rng.Next(26)),
            (char)('A' + rng.Next(26)),
            (char)('A' + rng.Next(26)),
        });
        var digits = rng.Next(10000, 99999);
        return $"{letters}-{digits}";
    }
}
