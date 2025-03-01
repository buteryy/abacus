import { NavLink } from "react-router"

export default function Nav() {
  return (
    <nav>
      <ul className="navbar">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/abacus-practice">Mental Practice</NavLink>
        </li>
        <li>
          <NavLink to="/mental-practice">Abacus Practice</NavLink>
        </li>
      </ul>
    </nav>
  )
}
