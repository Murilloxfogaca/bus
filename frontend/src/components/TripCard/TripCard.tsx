import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '../../store/useBookingStore'
import { formatarData, formatarHora, formatarPreco } from '../../utils/format'
import type { Viagem } from '../../types'

interface Props {
  viagem: Viagem
}

export function TripCard({ viagem }: Props) {
  const navigate = useNavigate()
  const setViagemSelecionada = useBookingStore((s) => s.setViagemSelecionada)

  function handleSelecionar() {
    setViagemSelecionada(viagem)
    navigate(`/viagens/${viagem.id}/assentos`)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1">
        <p className="text-lg font-semibold text-slate-800">
          {viagem.rota.origem} → {viagem.rota.destino}
        </p>
        <p className="text-sm text-slate-500 mt-0.5">
          {formatarData(viagem.dataHoraPartida)} às {formatarHora(viagem.dataHoraPartida)}
          {' · '}
          Duração: {viagem.rota.duracaoEstimada}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          <span
            className={`font-medium ${
              viagem.assentosDisponiveis === 0
                ? 'text-red-500'
                : viagem.assentosDisponiveis <= 5
                  ? 'text-amber-600'
                  : 'text-green-600'
            }`}
          >
            {viagem.assentosDisponiveis === 0
              ? 'Esgotado'
              : `${viagem.assentosDisponiveis} vagas restantes`}
          </span>
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="text-2xl font-bold text-blue-600">{formatarPreco(viagem.precoBase)}</p>
        <button
          onClick={handleSelecionar}
          disabled={viagem.assentosDisponiveis === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
        >
          Selecionar
        </button>
      </div>
    </div>
  )
}
