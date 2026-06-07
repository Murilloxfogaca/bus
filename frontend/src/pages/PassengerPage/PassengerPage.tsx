import { useNavigate, Navigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useBookingStore } from '../../store/useBookingStore'
import { reservasService } from '../../services/api'
import { PassengerForm } from '../../components/PassengerForm/PassengerForm'
import { formatarData, formatarHora, formatarPreco } from '../../utils/format'
import { getApiError } from '../../utils/apiError'
import type { Passageiro } from '../../types'

export function PassengerPage() {
  const navigate = useNavigate()
  const viagemSelecionada = useBookingStore((s) => s.viagemSelecionada)
  const assentoSelecionado = useBookingStore((s) => s.assentoSelecionado)
  const setReservaConfirmada = useBookingStore((s) => s.setReservaConfirmada)

  const { mutate: criarReserva, isPending, error } = useMutation({
    mutationFn: (passageiro: Passageiro) => {
      if (!viagemSelecionada || assentoSelecionado === null) {
        throw new Error('Dados de reserva inválidos')
      }
      return reservasService.criar({
        viagemId: viagemSelecionada.id,
        numeroAssento: assentoSelecionado,
        ...passageiro,
      })
    },
    onSuccess: (reserva) => {
      setReservaConfirmada(reserva)
      navigate('/sucesso')
    },
  })

  if (!viagemSelecionada || assentoSelecionado === null) {
    return <Navigate to="/" replace />
  }

  const errorMsg = error ? getApiError(error, 'Erro ao confirmar reserva. Tente novamente.') : null

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm mb-4 flex items-center gap-1"
        >
          ← Voltar
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-5">Dados do Passageiro</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-1">Resumo da compra</p>
          <p className="text-slate-600">
            {viagemSelecionada.rota.origem} → {viagemSelecionada.rota.destino}
          </p>
          <p className="text-slate-500 text-sm">
            {formatarData(viagemSelecionada.dataHoraPartida)} às{' '}
            {formatarHora(viagemSelecionada.dataHoraPartida)}
            {' · '}Assento {assentoSelecionado}
          </p>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {formatarPreco(viagemSelecionada.precoBase)}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <PassengerForm onSubmit={criarReserva} loading={isPending} />
        </div>
      </div>
    </div>
  )
}
