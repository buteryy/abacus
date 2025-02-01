import "./App.css"
import AbacussPractice from "./pages/AbacussPractice"
import AbacusQuiz from "./pages/AbacusQuiz"
import Layout from "./components/Layout"
import { Routes, Route } from "react-router"
import Multiplication from "./pages/Multiplication"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<h1>Abacus Practice Site</h1>} />
        <Route path="abacus-practice" element={<AbacussPractice />} />
        <Route path="abacus-practice/:id" element={<AbacusQuiz />} />
        <Route path="abacus-practive/multiplication" element={<Multiplication />} />
      </Route>
    </Routes>
  )
}

export default App
