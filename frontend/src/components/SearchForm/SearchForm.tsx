import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { useBookingStore } from '../../store/useBookingStore'
import { rotasService } from '../../services/api'
import { CityCombobox } from '../CityCombobox/CityCombobox'

export function SearchForm() {
  const navigate = useNavigate()
  const setBusca = useBookingStore((s) => s.setBusca)

  const hoje = new Date().toISOString().split('T')[0]

  const { data: rotas = [] } = useQuery({
    queryKey: ['rotas'],
    queryFn: rotasService.listar,
  })

  const [currentOrigem, setCurrentOrigem] = useState('')

  const form = useForm({
    defaultValues: {
      origem: '',
      destino: '',
      data: '',
    },
    onSubmit: async ({ value }) => {
      setBusca(value)
      navigate('/viagens')
    },
  })

  const origens = [...new Set(rotas.map((r) => r.origem))].sort()

  const destinos = currentOrigem
    ? [...new Set(rotas.filter((r) => r.origem === currentOrigem).map((r) => r.destino))].sort()
    : [...new Set(rotas.map((r) => r.destino))].sort()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="bg-white rounded-2xl shadow-md p-6 w-full max-w-2xl mx-auto"
      data-testid="search-form"
    >
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Buscar Passagens</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <form.Field
          name="origem"
          validators={{
            onSubmit: ({ value }) =>
              !value.trim() ? 'Selecione a cidade de origem' : undefined,
          }}
        >
          {(field) => (
            <CityCombobox
              id="origem"
              label="Origem"
              value={field.state.value}
              onChange={(v) => {
                field.handleChange(v)
                setCurrentOrigem(v)
                const validDestinos = rotas.filter((r) => r.origem === v).map((r) => r.destino)
                if (!validDestinos.includes(form.getFieldValue('destino'))) {
                  form.setFieldValue('destino', '')
                }
              }}
              onBlur={field.handleBlur}
              options={origens}
              placeholder="Selecione a origem"
              error={
                field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined
              }
            />
          )}
        </form.Field>

        <form.Field
          name="destino"
          validators={{
            onSubmit: ({ value }) => {
              if (!value.trim()) return 'Selecione a cidade de destino'
              if (value.trim() === form.state.values.origem.trim())
                return 'Origem e destino devem ser diferentes'
            },
          }}
        >
          {(field) => (
            <CityCombobox
              id="destino"
              label="Destino"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              options={destinos}
              placeholder="Selecione o destino"
              error={
                field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined
              }
            />
          )}
        </form.Field>
      </div>

      <div className="mb-5">
        <form.Field
          name="data"
          validators={{
            onSubmit: ({ value }) => (!value ? 'Selecione uma data' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-slate-600 mb-1">
                Data de ida
              </label>
              <input
                id="data"
                type="date"
                min={hoje}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={`w-full border rounded-lg px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 ${
                  field.state.meta.errors.length > 0 ? 'border-red-400' : 'border-slate-300'
                }`}
              />
              {field.state.meta.errors[0] ? (
                <p className="text-red-500 text-xs mt-1">
                  {String(field.state.meta.errors[0])}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        Buscar Passagens
      </button>
    </form>
  )
}
