import { create } from 'zustand'
import type { Viagem, Reserva } from '../types'

interface BookingState {
  busca: {
    origem: string
    destino: string
    data: string
  }
  viagemSelecionada: Viagem | null
  assentoSelecionado: number | null
  reservaConfirmada: Reserva | null

  setBusca: (busca: { origem: string; destino: string; data: string }) => void
  setViagemSelecionada: (viagem: Viagem) => void
  setAssentoSelecionado: (assento: number | null) => void
  setReservaConfirmada: (reserva: Reserva) => void
  resetBooking: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  busca: { origem: '', destino: '', data: '' },
  viagemSelecionada: null,
  assentoSelecionado: null,
  reservaConfirmada: null,

  setBusca: (busca) => set({ busca }),
  setViagemSelecionada: (viagem) => set({ viagemSelecionada: viagem, assentoSelecionado: null }),
  setAssentoSelecionado: (assento) => set({ assentoSelecionado: assento }),
  setReservaConfirmada: (reserva) => set({ reservaConfirmada: reserva }),
  resetBooking: () =>
    set({ viagemSelecionada: null, assentoSelecionado: null, reservaConfirmada: null }),
}))
