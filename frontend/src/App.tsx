import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SearchPage } from './pages/SearchPage/SearchPage'
import { TripsPage } from './pages/TripsPage/TripsPage'
import { SeatSelectionPage } from './pages/SeatSelectionPage/SeatSelectionPage'
import { PassengerPage } from './pages/PassengerPage/PassengerPage'
import { SuccessPage } from './pages/SuccessPage/SuccessPage'
import { ReservationPage } from './pages/ReservationPage/ReservationPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/viagens" element={<TripsPage />} />
        <Route path="/viagens/:id/assentos" element={<SeatSelectionPage />} />
        <Route path="/passageiro" element={<PassengerPage />} />
        <Route path="/sucesso" element={<SuccessPage />} />
        <Route path="/reservas" element={<ReservationPage />} />
      </Routes>
    </BrowserRouter>
  )
}
