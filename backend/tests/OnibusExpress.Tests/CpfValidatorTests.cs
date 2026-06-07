using FluentAssertions;
using OnibusExpress.Domain.Services;
using Xunit;

namespace OnibusExpress.Tests;

public class CpfValidatorTests
{
    [Theory]
    [InlineData("529.982.247-25")]
    [InlineData("52998224725")]
    [InlineData("111.444.777-35")]
    public void IsValid_ComCpfValido_RetornaTrue(string cpf)
    {
        CpfValidator.IsValid(cpf).Should().BeTrue();
    }

    [Theory]
    [InlineData("000.000.000-00")]
    [InlineData("111.111.111-11")]
    [InlineData("123.456.789-00")]
    [InlineData("12345")]
    [InlineData("")]
    [InlineData("abc.def.ghi-jk")]
    public void IsValid_ComCpfInvalido_RetornaFalse(string cpf)
    {
        CpfValidator.IsValid(cpf).Should().BeFalse();
    }

    [Fact]
    public void IsValid_RemoveFormatacao_AntesDeValidar()
    {
        var comMascara    = "529.982.247-25";
        var semMascara    = "52998224725";

        CpfValidator.IsValid(comMascara).Should().Be(CpfValidator.IsValid(semMascara));
    }
}
