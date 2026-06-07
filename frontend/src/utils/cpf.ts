export function formatarCPF(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function validarCPF(cpf: string): boolean {
  const digitos = cpf.replace(/\D/g, '')
  if (digitos.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digitos)) return false

  const calcDigito = (base: string, peso: number) => {
    const soma = base
      .split('')
      .reduce((acc, d, i) => acc + parseInt(d) * (peso - i), 0)
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const d1 = calcDigito(digitos.slice(0, 9), 10)
  if (d1 !== parseInt(digitos[9])) return false

  const d2 = calcDigito(digitos.slice(0, 10), 11)
  return d2 === parseInt(digitos[10])
}
