import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SearchForm } from '../components/SearchForm/SearchForm'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../store/useBookingStore', () => ({
  useBookingStore: (selector: (s: { setBusca: ReturnType<typeof vi.fn> }) => unknown) =>
    selector({ setBusca: vi.fn() }),
}))

vi.mock('../services/api', () => ({
  rotasService: {
    listar: vi.fn().mockResolvedValue([
      { id: 1, origem: 'São Paulo', destino: 'Rio de Janeiro', duracaoEstimada: '06:00:00' },
      { id: 2, origem: 'Rio de Janeiro', destino: 'São Paulo', duracaoEstimada: '06:00:00' },
    ]),
  },
}))

function renderForm() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SearchForm />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SearchForm', () => {
  beforeEach(() => mockNavigate.mockReset())

  it('renderiza os campos de origem, destino e data', () => {
    renderForm()
    expect(screen.getByLabelText(/origem/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/destino/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/data de ida/i)).toBeInTheDocument()
  })

  it('exibe erros quando os campos estão vazios', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /buscar passagens/i }))
    expect(screen.getByText(/selecione a cidade de origem/i)).toBeInTheDocument()
    expect(screen.getByText(/selecione a cidade de destino/i)).toBeInTheDocument()
    expect(screen.getByText(/selecione uma data/i)).toBeInTheDocument()
  })

  it('navega para /viagens ao preencher os campos', async () => {
    renderForm()

    await waitFor(() => expect(screen.getByLabelText(/origem/i)).toBeInTheDocument())

    await userEvent.click(screen.getByLabelText(/origem/i))
    await userEvent.click(screen.getByRole('option', { name: /São Paulo/i }))

    await userEvent.click(screen.getByLabelText(/destino/i))
    await userEvent.click(screen.getByRole('option', { name: /Rio de Janeiro/i }))

    await userEvent.type(screen.getByLabelText(/data de ida/i), '2026-12-01')

    await userEvent.click(screen.getByRole('button', { name: /buscar passagens/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/viagens')
  })
})
