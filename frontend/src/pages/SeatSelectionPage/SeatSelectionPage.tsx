import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useBookingStore } from '../../store/useBookingStore'
import { viagensService } from '../../services/api'
import { SeatMap } from '../../components/SeatMap/SeatMap'
import { formatarData, formatarHora, formatarPreco } from '../../utils/format'

export function SeatSelectionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const assentoSelecionado = useBookingStore((s) => s.assentoSelecionado)
  const setAssentoSelecionado = useBookingStore((s) => s.setAssentoSelecionado)

  const { data: viagem, isLoading, isError } = useQuery({
    queryKey: ['viagem', id],
    queryFn: () => viagensService.detalhes(Number(id)),
    enabled: !!id,
  })

  function handleContinuar() {
    if (assentoSelecionado !== null) {
      navigate('/passageiro')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !viagem) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-700">
          {isError ? 'Não foi possível carregar os assentos. Tente novamente.' : 'Viagem não encontrada.'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm mb-4 flex items-center gap-1"
        >
          ← Voltar
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            {viagem.rota.origem} → {viagem.rota.destino}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {formatarData(viagem.dataHoraPartida)} às {formatarHora(viagem.dataHoraPartida)}
            {' · '}
            Duração: {viagem.rota.duracaoEstimada}
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{formatarPreco(viagem.precoBase)}</p>
        </div>

        <h3 className="text-lg font-semibold text-slate-700 mb-3">Escolha seu assento</h3>
        <SeatMap
          assentos={viagem.assentos}
          selecionado={assentoSelecionado}
          onSelecionar={setAssentoSelecionado}
        />

        {assentoSelecionado && (
          <p className="text-center text-sm text-slate-500 mt-3">
            Assento <strong className="text-blue-600">{assentoSelecionado}</strong> selecionado
          </p>
        )}

        <button
          onClick={handleContinuar}
          disabled={assentoSelecionado === null}
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
