import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservasService } from '../../services/api'
import { formatarData, formatarHora, formatarPreco } from '../../utils/format'
import { getApiError } from '../../utils/apiError'

export function ReservationPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [codigo, setCodigo] = useState('')
  const [searchCodigo, setSearchCodigo] = useState('')
  const [cancelSuccess, setCancelSuccess] = useState(false)

  const { data: reserva, isLoading, isError } = useQuery({
    queryKey: ['reserva', searchCodigo],
    queryFn: () => reservasService.buscarPorCodigo(searchCodigo),
    enabled: !!searchCodigo,
    retry: false,
  })

  const { mutate: cancelar, isPending: cancelando, error: cancelError } = useMutation({
    mutationFn: () => reservasService.cancelar(reserva!.codigoReserva),
    onSuccess: () => {
      setCancelSuccess(true)
      queryClient.invalidateQueries({ queryKey: ['reserva', searchCodigo] })
    },
  })

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    if (!codigo.trim()) return
    setCancelSuccess(false)
    setSearchCodigo(codigo.trim().toUpperCase())
  }

  function handleCancelar() {
    if (!reserva) return
    const confirmar = window.confirm('Deseja cancelar esta reserva?')
    if (!confirmar) return
    cancelar()
  }

  const cancelErrorMsg = cancelError
    ? getApiError(cancelError, 'Não foi possível cancelar a reserva.')
    : null

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline text-sm mb-4 flex items-center gap-1"
        >
          ← Voltar ao início
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">Consultar Reserva</h1>

        <form onSubmit={handleBuscar} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Ex: ABC-12345"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {isLoading ? '...' : 'Buscar'}
          </button>
        </form>

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            Reserva não encontrada. Verifique o código e tente novamente.
          </div>
        )}

        {cancelErrorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            {cancelErrorMsg}
          </div>
        )}

        {cancelSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
            Reserva cancelada com sucesso.
          </div>
        )}

        {reserva && (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono font-bold text-blue-600 text-xl tracking-widest">
                {reserva.codigoReserva}
              </p>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  reserva.status === 'confirmada'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {reserva.status === 'confirmada' ? 'Confirmada' : 'Cancelada'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Trecho</span>
                <span className="font-medium">
                  {reserva.viagem.rota.origem} → {reserva.viagem.rota.destino}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Data</span>
                <span className="font-medium">{formatarData(reserva.viagem.dataHoraPartida)}</span>
              </div>
              <div className="flex justify-between">
                <span>Horário</span>
                <span className="font-medium">{formatarHora(reserva.viagem.dataHoraPartida)}</span>
              </div>
              <div className="flex justify-between">
                <span>Assento</span>
                <span className="font-medium">{reserva.numeroAssento}</span>
              </div>
              <div className="flex justify-between">
                <span>Passageiro</span>
                <span className="font-medium">{reserva.passageiro.nomeCompleto}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Valor</span>
                <span className="font-bold text-blue-600">
                  {formatarPreco(reserva.viagem.precoBase)}
                </span>
              </div>
            </div>

            {reserva.status === 'confirmada' && (
              <button
                onClick={handleCancelar}
                disabled={cancelando}
                className="w-full mt-5 border border-red-400 text-red-600 hover:bg-red-50 disabled:opacity-50 font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                {cancelando ? 'Cancelando...' : 'Cancelar Reserva'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
