import { useForm } from '@tanstack/react-form'
import { validarCPF, formatarCPF } from '../../utils/cpf'
import type { Passageiro } from '../../types'

interface Props {
  onSubmit: (passageiro: Passageiro) => void
  loading?: boolean
}

export function PassengerForm({ onSubmit, loading }: Props) {
  const form = useForm({
    defaultValues: {
      nomeCompleto: '',
      cpf: '',
      email: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  const inputCls = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError ? 'border-red-400' : 'border-slate-300'
    }`

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
      data-testid="passenger-form"
    >
      <form.Field
        name="nomeCompleto"
        validators={{
          onSubmit: ({ value }) =>
            value.trim().length < 3 ? 'Informe o nome completo' : undefined,
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-slate-600 mb-1">
              Nome completo
            </label>
            <input
              id="nomeCompleto"
              type="text"
              placeholder="Seu nome completo"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={inputCls(field.state.meta.errors.length > 0)}
            />
            {field.state.meta.errors[0] ? (
              <p className="text-red-500 text-xs mt-1">{String(field.state.meta.errors[0])}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="cpf"
        validators={{
          onSubmit: ({ value }) => (!validarCPF(value) ? 'CPF inválido' : undefined),
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-slate-600 mb-1">
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={field.state.value}
              onChange={(e) => field.handleChange(formatarCPF(e.target.value))}
              onBlur={field.handleBlur}
              maxLength={14}
              className={inputCls(field.state.meta.errors.length > 0)}
            />
            {field.state.meta.errors[0] ? (
              <p className="text-red-500 text-xs mt-1">{String(field.state.meta.errors[0])}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onSubmit: ({ value }) =>
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'E-mail inválido' : undefined,
        }}
      >
        {(field) => (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={inputCls(field.state.meta.errors.length > 0)}
            />
            {field.state.meta.errors[0] ? (
              <p className="text-red-500 text-xs mt-1">{String(field.state.meta.errors[0])}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
      >
        {loading ? 'Confirmando...' : 'Confirmar Reserva'}
      </button>
    </form>
  )
}
