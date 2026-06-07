import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PassengerForm } from '../components/PassengerForm/PassengerForm'

describe('PassengerForm', () => {
  it('exibe erros com campos vazios', async () => {
    render(<PassengerForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /confirmar reserva/i }))
    expect(screen.getByText(/informe o nome completo/i)).toBeInTheDocument()
    expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument()
    expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument()
  })

  it('exibe erro com CPF inválido', async () => {
    render(<PassengerForm onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByLabelText(/nome completo/i), 'João da Silva')
    await userEvent.type(screen.getByLabelText(/cpf/i), '111.111.111-11')
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'joao@email.com')
    await userEvent.click(screen.getByRole('button', { name: /confirmar reserva/i }))
    expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument()
  })

  it('chama onSubmit com dados válidos', async () => {
    const onSubmit = vi.fn()
    render(<PassengerForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/nome completo/i), 'João da Silva')
    await userEvent.type(screen.getByLabelText(/cpf/i), '52998224725')
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'joao@email.com')
    await userEvent.click(screen.getByRole('button', { name: /confirmar reserva/i }))
    expect(onSubmit).toHaveBeenCalledWith({
      nomeCompleto: 'João da Silva',
      cpf: '529.982.247-25',
      email: 'joao@email.com',
    })
  })

  it('mostra texto de carregamento quando loading=true', () => {
    render(<PassengerForm onSubmit={vi.fn()} loading={true} />)
    expect(screen.getByRole('button', { name: /confirmando/i })).toBeDisabled()
  })
})
