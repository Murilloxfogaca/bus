export interface Rota {
  id: number
  origem: string
  destino: string
  duracaoEstimada: string
}

export interface Viagem {
  id: number
  rota: Rota
  dataHoraPartida: string
  precoBase: number
  assentosDisponiveis: number
  totalAssentos: number
}

export interface Assento {
  numero: number
  ocupado: boolean
}

export interface ViagemDetalhes extends Viagem {
  assentos: Assento[]
}

export interface Passageiro {
  nomeCompleto: string
  cpf: string
  email: string
}

export interface CriarReservaRequest {
  viagemId: number
  numeroAssento: number
  nomeCompleto: string
  cpf: string
  email: string
}

export interface Reserva {
  id: number
  codigoReserva: string
  viagem: Viagem
  passageiro: Passageiro
  numeroAssento: number
  status: 'confirmada' | 'cancelada'
  criadaEm: string
}

export interface BuscarViagensParams {
  origem: string
  destino: string
  data: string
}
