import { useNavigate, Navigate } from 'react-router-dom'
import { useBookingStore } from '../../store/useBookingStore'
import { formatarData, formatarHora, formatarPreco } from '../../utils/format'

export function SuccessPage() {
  const navigate = useNavigate()
  const reservaConfirmada = useBookingStore((s) => s.reservaConfirmada)
  const resetBooking = useBookingStore((s) => s.resetBooking)

  if (!reservaConfirmada) {
    return <Navigate to="/" replace />
  }

  function handleNovaCompra() {
    resetBooking()
    navigate('/')
  }

  const { codigoReserva, viagem, passageiro, numeroAssento } = reservaConfirmada

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">Reserva confirmada!</h1>
          <p className="text-slate-500 text-sm mb-6">
            Um e-mail de confirmação será enviado para {passageiro.email}
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Código da Reserva</p>
            <p className="text-3xl font-mono font-bold text-blue-600 tracking-widest">
              {codigoReserva}
            </p>
          </div>

          <div className="text-left space-y-2 text-sm text-slate-600 mb-6">
            <div className="flex justify-between">
              <span>Trecho</span>
              <span className="font-medium">
                {viagem.rota.origem} → {viagem.rota.destino}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Data</span>
              <span className="font-medium">{formatarData(viagem.dataHoraPartida)}</span>
            </div>
            <div className="flex justify-between">
              <span>Horário</span>
              <span className="font-medium">{formatarHora(viagem.dataHoraPartida)}</span>
            </div>
            <div className="flex justify-between">
              <span>Assento</span>
              <span className="font-medium">{numeroAssento}</span>
            </div>
            <div className="flex justify-between">
              <span>Passageiro</span>
              <span className="font-medium">{passageiro.nomeCompleto}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Valor pago</span>
              <span className="font-bold text-blue-600">{formatarPreco(viagem.precoBase)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/reservas')}
              className="flex-1 border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Consultar reserva
            </button>
            <button
              onClick={handleNovaCompra}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              Nova passagem
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
