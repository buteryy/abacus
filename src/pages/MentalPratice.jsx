// import React from 'react'

// export default function MentalPratice() {
//   return (
//     <main>
//       <div className="quicksand-font" style={
//       {
//         background: "skyblue",
//         width: '80%',
//         margin: "10px auto",
//         textAlign: "center",
//         padding: "5px 0",
//         boxShadow: "2px 2px 10px black",
//         fontSize: "30px"
//       }
//     }>
//       <h1>Math Workout!</h1>
//     </div>
//     </main>
//   )
// }


import { NavLink } from "react-router";
import abacusLogo from "../assets/aba.png"

export default function MentalPratice() {
  return (
        <>
          <div className="quicksand-font" style={
            {
              background: "skyblue",
              width: '80%',
              margin: "10px auto",
              textAlign: "center",
              padding: "5px 0",
              boxShadow: "2px 2px 10px black",
              fontSize: "30px"
            }
          }>
            <h1>Mental Math Workout!</h1>
          </div>
          <div className=" abacus-logo-container">
            <img src={abacusLogo} alt="abacus" className="abacus-logo"/>
          </div>
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
          </div>

          <div className="container abacus-practice-container advanced">
              <NavLink to="11">
                <div className="box">
                  Advanced 1 (Addition)
                </div>
              </NavLink>
              <NavLink to="/abacus-practice/multiplication">
                <div className="box">
                  Advanced 2 (Multiplication)
                </div>
              </NavLink>

              <NavLink to="/abacus-practice/division">
                <div className="box">
                  Advanced 3 (Division)
                </div>
              </NavLink>
          </div>
        </>
  )
}
