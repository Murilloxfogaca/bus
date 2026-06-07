import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useBookingStore } from '../../store/useBookingStore'
import { viagensService } from '../../services/api'
import { TripCard } from '../../components/TripCard/TripCard'

export function TripsPage() {
  const navigate = useNavigate()
  const busca = useBookingStore((s) => s.busca)

  useEffect(() => {
    if (!busca.origem) navigate('/')
  }, [busca.origem, navigate])

  const { data: viagens = [], isLoading, isError } = useQuery({
    queryKey: ['viagens', busca],
    queryFn: () => viagensService.buscar(busca),
    enabled: !!busca.origem,
  })

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline text-sm mb-4 flex items-center gap-1"
        >
          ← Voltar
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          {busca.origem} → {busca.destino}
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {busca.data
            ? new Date(busca.data + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : ''}
        </p>

        {isLoading && (
          <div className="flex justify-center py-16" data-testid="loading">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-red-700">
            Não foi possível carregar as viagens. Tente novamente.
          </div>
        )}

        {!isLoading && !isError && viagens.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <p className="text-slate-500 text-lg">Nenhuma viagem encontrada para esse trecho.</p>
            <p className="text-slate-400 text-sm mt-1">Tente outra data ou destino.</p>
          </div>
        )}

        {!isLoading && !isError && viagens.length > 0 && (
          <div className="space-y-3">
            {viagens.map((v) => (
              <TripCard key={v.id} viagem={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
