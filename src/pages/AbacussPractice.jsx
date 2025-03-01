import { NavLink } from "react-router";

export default function AbacussPractice() {
  return (
        <>
          <h1>Levels 1-10</h1>
          <div className="container abacus-practice-container">
              <NavLink to="1">
                <div className="box">
                  Level 1
                </div>
              </NavLink>
              <NavLink to="2">
                <div className="box">
                  Level 2
                </div>
              </NavLink>
              <NavLink to="3">
                <div className="box">
                  Level 3
                </div>
              </NavLink>
              <NavLink to="4">
                <div className="box">
                  Level 4
                </div>
              </NavLink>
              <NavLink to="5">
                <div className="box">
                  Level 5
                </div>
              </NavLink>
              <NavLink to="6">
                <div className="box">
                  Level 6
                </div>
              </NavLink>
              <NavLink to="7">
                <div className="box">
                  Level 7
                </div>
              </NavLink>
              <NavLink to="8">
                <div className="box">
                  Level 8
                </div>
              </NavLink>
              <NavLink to="9">
                <div className="box">
                  Level 9
                </div>
              </NavLink>
              <NavLink to="10">
                <div className="box">
                  Level 10
                </div>
              </NavLink>
              {/* <div className="box">Level 2</div>
              <div className="box">Level 3</div>
              <div className="box">Level 4</div>
              <div className="box">Level 5</div>
              <div className="box">Level 6</div>
              <div className="box">Level 7</div>
              <div className="box">Level 8</div>
              <div className="box center">Level 9</div>
              <div className="box center">Level 10</div> */}
          </div>
          <h1>Advanced Levels 1-10</h1>
          <div className="container">
              <div className="box">Adv Level 1</div>
              <div className="box">Adv Level 2</div>
              <div className="box">Adv Level 3</div>
              <div className="box">Adv Level 4</div>
              <div className="box">Adv Level 5</div>
              <div className="box">Adv Level 6</div>
              <div className="box">Adv Level 7</div>
              <div className="box">Adv Level 8</div>
              <div className="box center">Adv Level 9</div>
              <div className="box center">Adv Level 10</div>
          </div>
        </>
  )
}
