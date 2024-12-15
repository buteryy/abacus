import './App.css'
import Nav from './components/Nav'
import AbacussPractice from './pages/AbacussPractice';
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
    <Nav />
    <Routes>
      <Route path="/" element={<h1>Abacus Practice Site</h1>} />
      <Route path='/abacuss-practice' element={<AbacussPractice />} />
    </Routes>
    </>
  )
}

export default App
