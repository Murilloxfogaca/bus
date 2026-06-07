import { SearchForm } from '../../components/SearchForm/SearchForm'

export function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">OniBus Express</h1>
        <p className="text-blue-100 text-lg">Sua passagem com comodidade e praticidade</p>
      </div>
      <div className="w-full max-w-2xl">
        <SearchForm />
      </div>
    </div>
  )
}
