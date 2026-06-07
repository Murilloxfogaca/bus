namespace OnibusExpress.Domain.Services;

public static class CpfValidator
{
    public static bool IsValid(string cpf)
    {
        cpf = new string(cpf.Where(char.IsDigit).ToArray());

        if (cpf.Length != 11) return false;
        if (cpf.Distinct().Count() == 1) return false;

        var d1 = CalcDigit(cpf, 9, 10);
        var d2 = CalcDigit(cpf, 10, 11);

        return cpf[9] - '0' == d1 && cpf[10] - '0' == d2;
    }

    private static int CalcDigit(string cpf, int length, int startFactor)
    {
        var sum = 0;
        for (var i = 0; i < length; i++)
            sum += (cpf[i] - '0') * (startFactor - i);
        var remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }
}
