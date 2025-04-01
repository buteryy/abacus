import "./App.css"
import AbacussPractice from "./pages/AbacussPractice"
import MentalPratice from "./pages/MentalPratice"
import AbacusQuiz from "./pages/AbacusQuiz"
import Layout from "./components/Layout"
import { Routes, Route } from "react-router"
import Multiplication from "./pages/Multiplication"
import Division from "./pages/Division"
import Home from "./pages/Home"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="abacus-practice" element={<AbacussPractice />} />
        <Route path="mental-practice" element={<MentalPratice />} />
        <Route path="abacus-practice/:id" element={<AbacusQuiz />} />
        <Route path="abacus-practice/multiplication" element={<Multiplication />} />
        <Route path="abacus-practice/division" element={<Division />} />
      </Route>
    </Routes>
  )
}

export default App
