import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router"
import Modal from "../components/Modal"
import "./Multiplication.css"
import { TIMER } from "../util"

export default function SimpleMultiplication() {
  const {id} = useParams()
  const timerRef = useRef(null) // Ref to store the timer ID
  const [levels, setLevels] = useState(() => {
    return generateLevels(30)
  })

  const [modalMessage, setModalMessage] = useState("") // Message for the modal
  const [time, setTime] = useState(TIMER)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isTimerPaused, setIsTimerPaused] = useState(false)
  const [timesup, setTimesup] = useState(false)
  const [score, setScore] = useState(0) // Score counter
  const [isSubmitted, setIsSubmitted] = useState(false) // Track if quiz has been submitted

  function handleTimer() {
    if (!isTimerRunning && !isTimerPaused) {
      // Start the timer for the first time
      setLevels(generateLevels(30))
      setModalMessage('')
      setScore(0)
      setTimesup(false)
      setIsTimerRunning(true)
      setIsTimerPaused(false)
      setTime(TIMER)
      setIsSubmitted(false) // Reset submitted state
      
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timerRef.current)
            timerRef.current = null
            setIsTimerRunning(false)
            setIsTimerPaused(false)
            setTimesup(true)
            setModalMessage("Time's up! Please revise your answers.")
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (isTimerRunning && !isTimerPaused) {
      // Pause the timer
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsTimerPaused(true)
    } else if (isTimerPaused) {
      // Continue the timer
      setIsTimerPaused(false)
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timerRef.current)
            timerRef.current = null
            setIsTimerRunning(false)
            setIsTimerPaused(false)
            setTimesup(true)
            setModalMessage("Time's up! Please revise your answers.")
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
  }

  function resetTimer() {
    clearInterval(timerRef.current)
    timerRef.current = null
    setIsTimerRunning(false)
    setIsTimerPaused(false)
    setTime(TIMER)
    setScore(0)
    setTimesup(false)
    setLevels(generateLevels(30))
    setModalMessage('')
    setIsSubmitted(false) // Reset submitted state
  }

  function getRandomNumber() {
    return Math.random()
  }

  function generateLevels(totalLevels) {
    if (id == 5 ) totalLevels = 10
    if (id == 4) totalLevels = 10
    
    const levels = []
    let numbers = []
    for (let i = 0; i < totalLevels; i++) {
      let num1
      let num2
      if (id == 1) {
         num1 = Math.floor(getRandomNumber() * 90 + 10)
         num2 = Math.floor(getRandomNumber() * 900 + 100)
      }
      if (id == 2) {
        num1 = Math.floor(getRandomNumber() * 90 + 10)
        num2 = Math.floor(getRandomNumber() * 90 + 10)
      }
      if (id == 3) {
        if (i < 10) {
          num1 = Math.floor(getRandomNumber() * 900 + 100)
          num2 = Math.floor(getRandomNumber() * 10 + 1)
        } else {
          num1 = Math.floor(getRandomNumber() * 90 + 10)
          num2 = Math.floor(getRandomNumber() * 90 + 10)
        } 
      }

      if (id == 4) {
        if (i < 5 ) {
          num1 = Math.floor(getRandomNumber() * 90 + 10)
          num2 = Math.floor(getRandomNumber() * 10) 
          if (num2 == 0) num2++
        } else {
          num1 = Math.floor(getRandomNumber() * 900 + 100)
          num2 = Math.floor(getRandomNumber() * 10 )
          if (num2 == 0) num2++
        } 
      }

      if (id == 5) {
        num1 = Math.floor(getRandomNumber() * 90 + 10)
        num2 = Math.floor(getRandomNumber() * 10 + 1)
      }
      
      
      if (getRandomNumber() > 0.5) {
        // Swap the numbers randomly
        numbers = [num1, num2]
      } else {
        numbers = [num2, num1]
      }

      if (id == 4) {
        numbers = [num1, num2]
      }
      const correctAns = numbers[0] * numbers[1]
      levels.push({
        level: i + 1,
        numbers,
        correctAns,
        userSolution: "",
        isCorrect: null,
      })
    }
    return levels
  }

  function handleInputChange(levelIndex, value) {
    setLevels((prevLevels) =>
      prevLevels.map((level, index) => {
        if (index === levelIndex) {
          const updatedLevel = { ...level, userSolution: value }
          // If quiz is submitted, recalculate correctness in real-time
          if (isSubmitted) {
            const isCorrect = value === "" ? false : parseInt(value, 10) === level.correctAns
            updatedLevel.isCorrect = isCorrect
          }
          return updatedLevel
        }
        return level
      })
    )
  }

  function checkSolution() {
    // Stop the timer when submitting
    if (isTimerRunning) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsTimerRunning(false)
      setIsTimerPaused(false)
    }

    // Mark as submitted
    setIsSubmitted(true)

    setLevels((prevLevels) => {
      const updatedLevels = prevLevels.map((level) => {
        const isCorrect =
          level.userSolution === "" // Empty answers
            ? false
            : parseInt(level.userSolution, 10) === level.correctAns
        return { ...level, isCorrect }
      })
      
      // Calculate and update score
      const correctCount = updatedLevels.filter(level => level.isCorrect === true).length
      setScore(correctCount)
      
      return updatedLevels
    })
  }

  const levelsCompleted = levels.filter((level) => level.isCorrect).length

  let levelAchieved = ""
  if (levelsCompleted === 40) {
    levelAchieved = "4"
  } else if (levelsCompleted >= 35) {
    levelAchieved = "3"
  } else if (levelsCompleted >= 30) {
    levelAchieved = "2"
  } else if (levelsCompleted >= 25) {
    levelAchieved = "1"
  } else if (levelsCompleted > 0) {
    levelAchieved = "0"
  }

  useEffect(() => {
    if (timesup) {
      // Clear the timer when time's up
      clearInterval(timerRef.current)
      timerRef.current = null
      // reset the timer
      setTime(TIMER)
      // submit the answers when time is up
      checkSolution()
    }
    return () => {
      clearInterval(timerRef.current)
    }
  }, [timesup])

  // Update score when levels change
  useEffect(() => {
    const correctAnswers = levels.filter((level) => level.isCorrect).length
    setScore(correctAnswers)
  }, [levels])

  return (
    <>
      <h1 className="main-heading">Basic Multiplication</h1>
      {/* Quiz Timer */}
      <div className="quiz-timer">
        {(isTimerRunning || isTimerPaused) && (
          <h2>
            Time Remaining: {Math.floor(time / 60)} minutes{" "}
            {String(time % 60).padStart(2, "0")} seconds
            {isTimerPaused && <span style={{ color: 'red', marginLeft: '10px' }}>(PAUSED)</span>}
          </h2>
        )}
        {isSubmitted && (
          <h2 style={{ color: "#4CAF50" }}>
            Practice Mode - No Timer
          </h2>
        )}
        <h3>Score: {score} / {id == 5 || id == 4 ? 10 : 30}</h3>
        <button
          onClick={handleTimer}
          style={{
            padding: "10px 20px",
            backgroundColor: isTimerPaused ? '#FF9800' : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px",
            marginTop: "20px",
          }}
        >
          {!isTimerRunning && !isTimerPaused 
            ? 'Start Timer' 
            : isTimerPaused 
            ? 'Continue' 
            : 'Pause'}
        </button>
        {(isTimerRunning || isTimerPaused) && (
          <button
            onClick={resetTimer}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginLeft: '10px',
              marginTop: '20px',
            }}
          >
            Reset Timer
          </button>
        )}
        {/* Show level achived */}
        {levelAchieved && <h1> Level Achieved: {levelAchieved}</h1>}
      </div>
      <div className="multiplication-cards-container" style={{
        filter: isTimerPaused ? 'blur(5px)' : 'none',
        transition: 'filter 0.3s ease'
      }}>
        {levels.map((level, index) => (
          <div key={level.level} className="multiplication-card">
            <div className="multiplication-card-sr-num">
              {index < 9 ? `0${index + 1}` : index + 1}
            </div>
            <div
              className="quiz-numbers-and-input"
              style={{
                backgroundColor:
                  level.isCorrect === null
                    ? "white" // Default white for unattempted levels
                    : level.isCorrect
                    ? "lightgreen" // Green for correct answers
                    : "lightcoral", // Red for wrong or empty answers
              }}
            >
              <span key={index}>
                {level.numbers[0]} x {level.numbers[1]} =
              </span>
              <input
                value={level.userSolution}
                onChange={(e) => handleInputChange(index, +e.target.value)}
                type="number"
                placeholder="Answer"
                disabled={!isTimerRunning && !isSubmitted || isTimerPaused} // Enable input in practice mode after submission
              />
            </div>
          </div>
        ))}
      </div>
      <div className="multiplication-buttons">
        <button
          onClick={checkSolution}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Submit
        </button>
        <button
          onClick={() => {
            setLevels(generateLevels(30))
            setScore(0)
            setIsSubmitted(false) // Reset submitted state when clearing
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px",
            marginTop: "20px",
          }}
        >
          Clear All
        </button>
      </div>

      {modalMessage && (
        <Modal
          message={modalMessage}
          onClose={() => setModalMessage("")} // Close the modal
        />
      )}
    </>
  )
}
// import { useState, useEffect, useRef } from "react"
// import { useParams } from "react-router"
// import Modal from "../components/Modal"
// import "./Multiplication.css"
// import { TIMER } from "../util"

// export default function SimpleMultiplication() {
//   const {id} = useParams()
//   const timerRef = useRef(null) // Ref to store the timer ID
//   const [levels, setLevels] = useState(() => {
//     return generateLevels(30)
//   })

//   const [modalMessage, setModalMessage] = useState("") // Message for the modal
//   const [time, setTime] = useState(TIMER)
//   const [isTimerRunning, setIsTimerRunning] = useState(false)
//   const [timesup, setTimesup] = useState(false)

//   function handleTimer() {
//     if (isTimerRunning) {
//       // Stop the timer
//       clearInterval(timerRef.current)
//       timerRef.current = null
//       setIsTimerRunning(false)
//       setTimesup(false)
//       setTime(TIMER) // Reset the time
//     } else {
//       // Reset states when starting the timer
//       setTimesup(false)
//       setLevels(generateLevels(30)) // Reset levels
//       setModalMessage("") // Clear modal message
//       setTime(TIMER) // Reset time

//       // Start the timer after resetting the time
//       setIsTimerRunning(true)
//       timerRef.current = setInterval(() => {
//         setTime((prevTime) => {
//           if (prevTime === 0) {
//             clearInterval(timerRef.current) // Clear the timer
//             timerRef.current = null
//             setIsTimerRunning(false)
//             setTimesup(true)
//             setModalMessage("Time's up! Please revise your answers.")
//             return 0 // Stop at 0
//           }
//           return prevTime - 1
//         })
//       }, 1000)
//     }
//   }

//   function getRandomNumber() {
//     return Math.random()
//   }

//   function generateLevels(totalLevels) {
//     if (id == 5 ) totalLevels = 10
//     if (id == 4) totalLevels = 10
    
//     const levels = []
//     let numbers = []
//     for (let i = 0; i < totalLevels; i++) {
//       let num1
//       let num2
//       if (id == 1) {
//          num1 = Math.floor(getRandomNumber() * 90 + 10)
//          num2 = Math.floor(getRandomNumber() * 900 + 100)
//       }
//       if (id == 2) {
//         num1 = Math.floor(getRandomNumber() * 90 + 10)
//         num2 = Math.floor(getRandomNumber() * 90 + 10)
//       }
//       if (id == 3) {
//         if (i < 10) {
//           num1 = Math.floor(getRandomNumber() * 900 + 100)
//           num2 = Math.floor(getRandomNumber() * 10 + 1)
//         } else {
//           num1 = Math.floor(getRandomNumber() * 90 + 10)
//           num2 = Math.floor(getRandomNumber() * 90 + 10)
//         } 
//       }

//       if (id == 4) {
//         if (i < 5 ) {
//           num1 = Math.floor(getRandomNumber() * 90 + 10)
//           num2 = Math.floor(getRandomNumber() * 10) 
//           if (num2 == 0) num2++
//         } else {
//           num1 = Math.floor(getRandomNumber() * 900 + 100)
//           num2 = Math.floor(getRandomNumber() * 10 )
//           if (num2 == 0) num2++
//         } 
//       }

//       if (id == 5) {
//         num1 = Math.floor(getRandomNumber() * 90 + 10)
//         num2 = Math.floor(getRandomNumber() * 10 + 1)
//       }
      
      
//       if (getRandomNumber() > 0.5) {
//         // Swap the numbers randomly
//         numbers = [num1, num2]
//       } else {
//         numbers = [num2, num1]
//       }

//       if (id == 4) {
//         numbers = [num1, num2]
//       }
//       const correctAns = numbers[0] * numbers[1]
//       levels.push({
//         level: i + 1,
//         numbers,
//         correctAns,
//         userSolution: "",
//         isCorrect: null,
//       })
//     }
//     return levels
//   }

//   function handleInputChange(levelIndex, value) {
//     setLevels((prevLevels) =>
//       prevLevels.map((level, index) =>
//         index === levelIndex ? { ...level, userSolution: value } : level
//       )
//     )
//   }

//   function checkSolution() {
//     setLevels((prevLevels) =>
//       prevLevels.map((level) => {
//         const isCorrect =
//           level.userSolution === "" // Empty answers
//             ? false
//             : parseInt(level.userSolution, 10) === level.correctAns
//         return { ...level, isCorrect }
//       })
//     )
//   }

//   const levelsCompleted = levels.filter((level) => level.isCorrect).length

//   let levelAchieved = ""
//   if (levelsCompleted === 40) {
//     levelAchieved = "4"
//   } else if (levelsCompleted >= 35) {
//     levelAchieved = "3"
//   } else if (levelsCompleted >= 30) {
//     levelAchieved = "2"
//   } else if (levelsCompleted >= 25) {
//     levelAchieved = "1"
//   } else if (levelsCompleted > 0) {
//     levelAchieved = "0"
//   }

//   useEffect(() => {
//     if (timesup) {
//       // Clear the timer when time's up
//       clearInterval(timerRef.current)
//       timerRef.current = null
//       // reset the timer
//       setTime(TIMER)
//       // submit the answers when time is up
//       checkSolution()
//     }
//     return () => {
//       clearInterval(timerRef.current)
//     }
//   }, [timesup])

//   return (
//     <>
//       <h1 className="main-heading">Basic Multiplication</h1>
//       {/* Quiz Timer */}
//       <div className="quiz-timer">
//         {isTimerRunning && (
//           <h2>
//             Time Remaining: {Math.floor(time / 60)} minutes{" "}
//             {String(time % 60).padStart(2, "0")} seconds
//           </h2>
//         )}
//         <button
//           onClick={handleTimer}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginLeft: "10px",
//             marginTop: "20px",
//           }}
//         >
//           {isTimerRunning ? "Stop & Reset Timer" : "Start Timer"}
//         </button>
//         {/* Show level achived */}
//         {levelAchieved && <h1> Level Achieved: {levelAchieved}</h1>}
//       </div>
//       <div className="multiplication-cards-container">
//         {levels.map((level, index) => (
//           <div key={level.level} className="multiplication-card">
//             <div className="multiplication-card-sr-num">
//               {index < 9 ? `0${index + 1}` : index + 1}
//             </div>
//             <div
//               className="quiz-numbers-and-input"
//               style={{
//                 backgroundColor:
//                   level.isCorrect === null
//                     ? "white" // Default white for unattempted levels
//                     : level.isCorrect
//                     ? "lightgreen" // Green for correct answers
//                     : "lightcoral", // Red for wrong or empty answers
//               }}
//             >
//               <span key={index}>
//                 {level.numbers[0]} x {level.numbers[1]} =
//               </span>
//               <input
//                 value={level.userSolution}
//                 onChange={(e) => handleInputChange(index, +e.target.value)}
//                 type="number"
//                 placeholder="Answer"
//                 disabled={level.isCorrect || !isTimerRunning} // Disable input if already evaluated
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="multiplication-buttons">
//         <button
//           onClick={checkSolution}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginTop: "20px",
//           }}
//         >
//           Submit
//         </button>
//         <button
//           onClick={() => setLevels(generateLevels(30))}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#f44336",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginLeft: "10px",
//             marginTop: "20px",
//           }}
//         >
//           Clear All
//         </button>
//       </div>

//       {modalMessage && (
//         <Modal
//           message={modalMessage}
//           onClose={() => setModalMessage("")} // Close the modal
//         />
//       )}
//     </>
//   )
// }
