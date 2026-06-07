import type { Assento } from '../../types'

interface Props {
  assentos: Assento[]
  selecionado: number | null
  onSelecionar: (numero: number) => void
}

export function SeatMap({ assentos, selecionado, onSelecionar }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6" data-testid="seat-map">
      <div className="flex justify-center gap-6 mb-5 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border-2 border-slate-300 bg-slate-50" />
          <span className="text-slate-600">Livre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600" />
          <span className="text-slate-600">Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-300" />
          <span className="text-slate-600">Ocupado</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {assentos.map((assento) => {
          const isSelecionado = assento.numero === selecionado
          const isOcupado = assento.ocupado

          return (
            <button
              key={assento.numero}
              onClick={() => !isOcupado && onSelecionar(assento.numero)}
              disabled={isOcupado}
              data-testid={`seat-${assento.numero}`}
              aria-label={`Assento ${assento.numero}${isOcupado ? ' (ocupado)' : isSelecionado ? ' (selecionado)' : ' (livre)'}`}
              className={`
                w-12 h-12 rounded-lg text-sm font-semibold border-2 transition-all
                ${
                  isOcupado
                    ? 'bg-slate-300 border-slate-300 cursor-not-allowed text-slate-400'
                    : isSelecionado
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105'
                      : 'bg-slate-50 border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-700 cursor-pointer'
                }
              `}
            >
              {assento.numero}
            </button>
          )
        })}
      </div>
    </div>
  )
}
