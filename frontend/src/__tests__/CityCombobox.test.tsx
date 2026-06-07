import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CityCombobox } from '../components/CityCombobox/CityCombobox'

const cidades = ['Belo Horizonte', 'Curitiba', 'Rio de Janeiro', 'São Paulo']

function renderCombobox(overrides: Partial<React.ComponentProps<typeof CityCombobox>> = {}) {
  const onChange = vi.fn()
  const onBlur = vi.fn()

  render(
    <CityCombobox
      id="cidade"
      label="Cidade"
      value=""
      onChange={onChange}
      onBlur={onBlur}
      options={cidades}
      placeholder="Selecione uma cidade"
      {...overrides}
    />,
  )

  return { onChange, onBlur }
}

describe('CityCombobox', () => {
  it('renderiza label e placeholder', () => {
    renderCombobox()
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Selecione uma cidade')).toBeInTheDocument()
  })

  it('abre dropdown ao focar no input', async () => {
    renderCombobox()
    await userEvent.click(screen.getByRole('textbox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    cidades.forEach((c) => expect(screen.getByText(c)).toBeInTheDocument())
  })

  it('filtra opções ao digitar', async () => {
    renderCombobox()
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.type(input, 'são')
    expect(screen.getByText('São Paulo')).toBeInTheDocument()
    expect(screen.queryByText('Curitiba')).not.toBeInTheDocument()
  })

  it('chama onChange ao selecionar opção', async () => {
    const { onChange } = renderCombobox()
    await userEvent.click(screen.getByRole('textbox'))
    fireEvent.mouseDown(screen.getByText('São Paulo'))
    expect(onChange).toHaveBeenCalledWith('São Paulo')
  })

  it('exibe mensagem quando nenhuma cidade é encontrada', async () => {
    renderCombobox()
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.type(input, 'xyz')
    expect(screen.getByText('Nenhuma cidade encontrada')).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando prop error é passada', () => {
    renderCombobox({ error: 'Selecione a cidade de origem' })
    expect(screen.getByText('Selecione a cidade de origem')).toBeInTheDocument()
  })

  it('navega com teclado e seleciona com Enter', async () => {
    const { onChange } = renderCombobox()
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(cidades[0])
  })

  it('fecha dropdown ao pressionar Escape', async () => {
    renderCombobox()
    await userEvent.click(screen.getByRole('textbox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('marca a opção selecionada com aria-selected', async () => {
    renderCombobox({ value: 'São Paulo' })
    await userEvent.click(screen.getByRole('textbox'))
    const selected = screen.getByRole('option', { name: /São Paulo/ })
    expect(selected).toHaveAttribute('aria-selected', 'true')
  })
})
