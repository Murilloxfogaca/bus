import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SeatMap } from '../components/SeatMap/SeatMap'
import type { Assento } from '../types'

const assentos: Assento[] = [
  { numero: 1, ocupado: false },
  { numero: 2, ocupado: true },
  { numero: 3, ocupado: false },
]

describe('SeatMap', () => {
  it('renderiza todos os assentos', () => {
    render(<SeatMap assentos={assentos} selecionado={null} onSelecionar={vi.fn()} />)
    expect(screen.getByTestId('seat-1')).toBeInTheDocument()
    expect(screen.getByTestId('seat-2')).toBeInTheDocument()
    expect(screen.getByTestId('seat-3')).toBeInTheDocument()
  })

  it('chama onSelecionar ao clicar em assento livre', async () => {
    const onSelecionar = vi.fn()
    render(<SeatMap assentos={assentos} selecionado={null} onSelecionar={onSelecionar} />)
    await userEvent.click(screen.getByTestId('seat-1'))
    expect(onSelecionar).toHaveBeenCalledWith(1)
  })

  it('não chama onSelecionar ao clicar em assento ocupado', async () => {
    const onSelecionar = vi.fn()
    render(<SeatMap assentos={assentos} selecionado={null} onSelecionar={onSelecionar} />)
    await userEvent.click(screen.getByTestId('seat-2'))
    expect(onSelecionar).not.toHaveBeenCalled()
  })

  it('aplica estilo de selecionado no assento escolhido', () => {
    render(<SeatMap assentos={assentos} selecionado={3} onSelecionar={vi.fn()} />)
    const seat3 = screen.getByTestId('seat-3')
    expect(seat3).toHaveClass('bg-blue-600')
  })

  it('assento ocupado está desabilitado', () => {
    render(<SeatMap assentos={assentos} selecionado={null} onSelecionar={vi.fn()} />)
    expect(screen.getByTestId('seat-2')).toBeDisabled()
  })
})
