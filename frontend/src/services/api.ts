import axios from 'axios'
import type {
  Viagem,
  ViagemDetalhes,
  Rota,
  Reserva,
  CriarReservaRequest,
  BuscarViagensParams,
} from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
})

export const rotasService = {
  listar: () => api.get<Rota[]>('/rotas').then((r) => r.data),
}

export const viagensService = {
  buscar: (params: BuscarViagensParams) =>
    api.get<Viagem[]>('/viagens', { params }).then((r) => r.data),

  detalhes: (id: number) =>
    api.get<ViagemDetalhes>(`/viagens/${id}`).then((r) => r.data),
}

export const reservasService = {
  criar: (dados: CriarReservaRequest) =>
    api.post<Reserva>('/reservas', dados).then((r) => r.data),

  buscarPorCodigo: (codigo: string) =>
    api.get<Reserva>(`/reservas/${codigo}`).then((r) => r.data),

  cancelar: (codigo: string) =>
    api.delete(`/reservas/${codigo}`).then((r) => r.data),
}

export default api
