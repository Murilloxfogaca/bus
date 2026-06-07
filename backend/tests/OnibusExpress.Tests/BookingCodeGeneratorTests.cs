using FluentAssertions;
using OnibusExpress.Domain.Services;
using System.Text.RegularExpressions;
using Xunit;

namespace OnibusExpress.Tests;

public class BookingCodeGeneratorTests
{
    private static readonly Regex _pattern = new(@"^[A-Z]{3}-\d{5}$");

    [Fact]
    public void Generate_RetornaCodigoNoFormatoEsperado()
    {
        var codigo = BookingCodeGenerator.Generate();
        _pattern.IsMatch(codigo).Should().BeTrue(because: $"o código '{codigo}' deve seguir o padrão AAA-99999");
    }

    [Fact]
    public void Generate_RetornaCodigos_Distintos()
    {
        var codigos = Enumerable.Range(0, 100)
            .Select(_ => BookingCodeGenerator.Generate())
            .ToList();

        codigos.Distinct().Count().Should().BeGreaterThan(90,
            because: "a chance de colisão em 100 gerações deve ser mínima");
    }
}
