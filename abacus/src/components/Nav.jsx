import { NavLink } from "react-router";

export default function Nav() {
  return (
    <nav >
    <ul class="navbar">
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/abacuss-practice">Abacus Practice</NavLink></li>
      <li><NavLink to="/mental-practice">Mental Practice</NavLink></li>
    </ul>
  </nav>
  )
}
