import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router"
import Modal from "../components/Modal"
import "./Division.css"
import { generateRandomNumber, TIMER } from "../util"

export default function SimpleDivision() {
  const {id} = useParams()
  const timerRef = useRef(null) // Ref to store the timer ID
  const [levels, setLevels] = useState(() => {
    return generateLevels(30)
  })

  const [modalMessage, setModalMessage] = useState("") // Message for the modal
  const [time, setTime] = useState(TIMER)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timesup, setTimesup] = useState(false)
  const [score, setScore] = useState(0) // Score counter
  const [isSubmitted, setIsSubmitted] = useState(false) // Track if quiz has been submitted

  function handleTimer() {
    if (isTimerRunning && !isPaused) {
      // Pause the timer
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsPaused(true)
    } else if (isTimerRunning && isPaused) {
      // Continue the timer
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timerRef.current) // Clear the timer
            timerRef.current = null
            setIsTimerRunning(false)
            setIsPaused(false)
            setTimesup(true)
            setModalMessage("Time's up! Please revise your answers.")
            return 0 // Stop at 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else {
      // Start the timer for the first time
      setTimesup(false)
      setLevels(generateLevels(30)) // Reset levels
      setModalMessage("") // Clear modal message
      setTime(TIMER) // Reset time
      setScore(0) // Reset score
      setIsPaused(false)
      setIsSubmitted(false) // Reset submitted state

      // Start the timer after resetting the time
      setIsTimerRunning(true)
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timerRef.current) // Clear the timer
            timerRef.current = null
            setIsTimerRunning(false)
            setIsPaused(false)
            setTimesup(true)
            setModalMessage("Time's up! Please revise your answers.")
            return 0 // Stop at 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
  }

  function getRandomNumber() {
    return Math.random()
  }

  function generateLevels(totalLevels) {
    if (id == 5) totalLevels = 10
    if (id == 4) totalLevels = 10
  
    const levels = []
    for (let i = 0; i < totalLevels; i++) {
      let num1, num2
  
      if (id == 1) {
        // 5-digit number ÷ 2/3-digit number = whole number
        num2 = generateRandomNumber(Math.random() > 0.5 ? 3 : 2)
        const quotient = generateRandomNumber(5 - num2.toString().length) // to keep num1 within 5 digits
        num1 = num2 * quotient
      }
  
      if (id == 2) {
        // quotient and divisor between 2–10
        const quotient = Math.floor(getRandomNumber() * 9 + 2)
        num2 = Math.floor(getRandomNumber() * 9 + 2)
        num1 = quotient * num2
      }
  
      if (id == 3) {
        if (i < 10) {
          // quotient: 10–99, divisor: 2–10
          const quotient = Math.floor(getRandomNumber() * 90 + 10)
          num2 = Math.floor(getRandomNumber() * 9 + 2)
          num1 = quotient * num2
        } else {
          // quotient and divisor between 2–10
          const quotient = Math.floor(getRandomNumber() * 9 + 2)
          num2 = Math.floor(getRandomNumber() * 9 + 2)
          num1 = quotient * num2
        }
      }
  
      if (id == 4) {
        if (i < 5) {
          // quotient and divisor between 2–10
          const quotient = Math.floor(getRandomNumber() * 9 + 2)
          num2 = Math.floor(getRandomNumber() * 9 + 2)
          num1 = quotient * num2
        } else {
          // quotient: 10–99, divisor: 2–10
          const quotient = Math.floor(getRandomNumber() * 90 + 10)
          num2 = Math.floor(getRandomNumber() * 9 + 2)
          num1 = quotient * num2
        }
      }
  
      if (id == 5) {
        // quotient: 10–99, divisor: 2–10
        const quotient = Math.floor(getRandomNumber() * 90 + 10)
        num2 = Math.floor(getRandomNumber() * 9 + 2)
        num1 = quotient * num2
      }
  
      levels.push({
        level: i + 1,
        numbers: [num1, num2],
        correctAns: num1 / num2,
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
      setIsPaused(false)
    }

    // Mark as submitted
    setIsSubmitted(true)

    setLevels((prevLevels) =>
      prevLevels.map((level) => {
        const isCorrect =
          level.userSolution === "" // Empty answers
            ? false
            : parseInt(level.userSolution, 10) === level.correctAns
        return { ...level, isCorrect }
      })
    )
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
      setIsPaused(false)
      // reset the timer
      setTime(TIMER)
      // submit the answers when time is up
      checkSolution()
    }
  }, [timesup])

  // Update score when levels change
  useEffect(() => {
    const correctAnswers = levels.filter((level) => level.isCorrect).length
    setScore(correctAnswers)
  }, [levels])

  function getButtonText() {
    if (!isTimerRunning) {
      return "Start Timer"
    } else if (isPaused) {
      return "Continue"
    } else {
      return "Pause"
    }
  }

  return (
    <>
      <h1 className="main-heading">Basic Division</h1>
      {/* Quiz Timer */}
      <div className="quiz-timer">
        {/* {isTimerRunning && (
          <h2>
            Time Remaining: {Math.floor(time / 60)} minutes{" "}
            {String(time % 60).padStart(2, "0")} seconds
          </h2>
        )} */}
         {(isTimerRunning || isPaused) && (
          <h2>
            Time Remaining: {Math.floor(time / 60)} minutes{' '}
            {String(time % 60).padStart(2, '0')} seconds
            {isPaused && <span style={{ color: 'red', marginLeft: '10px' }}>(PAUSED)</span>}
          </h2>
        )}
        {isSubmitted && (
          <h2 style={{ color: "#4CAF50" }}>
            Practice Mode - No Timer
          </h2>
        )}
        <button
          onClick={handleTimer}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "10px",
            marginTop: "20px",
          }}
        >
          {getButtonText()}
        </button>
        {/* Show score counter */}
        <h2 style={{ marginTop: "10px" }}>Score: {score} correct answers</h2>
        {/* Show level achieved */}
        {levelAchieved && <h1> Level Achieved: {levelAchieved}</h1>}
      </div>
      <div className="division-cards-container">
        {levels.map((level, index) => (
          <div 
            key={level.level} 
            className="division-card"
            style={{
              filter: isPaused ? 'blur(8px)' : 'none',
              transition: 'filter 0.3s ease'
            }}
          >
            <div className="division-card-sr-num">
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
                {level.numbers[0].toLocaleString()} ÷ {level.numbers[1]} =
              </span>
              <input
                value={level.userSolution}
                onChange={(e) => handleInputChange(index, +e.target.value)}
                type="number"
                placeholder="Answer"
                disabled={!isTimerRunning && !isSubmitted || isPaused} // Enable input in practice mode after submission
              />
            </div>
          </div>
        ))}
      </div>
      <div className="division-buttons">
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
// import "./Division.css"
// import { generateRandomNumber, TIMER } from "../util"

// export default function SimpleDivision() {
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
//     if (id == 5) totalLevels = 10
//     if (id == 4) totalLevels = 10
  
//     const levels = []
//     for (let i = 0; i < totalLevels; i++) {
//       let num1, num2
  
//       if (id == 1) {
//         // 5-digit number ÷ 2/3-digit number = whole number
//         num2 = generateRandomNumber(Math.random() > 0.5 ? 3 : 2)
//         const quotient = generateRandomNumber(5 - num2.toString().length) // to keep num1 within 5 digits
//         num1 = num2 * quotient
//       }
  
//       if (id == 2) {
//         // quotient and divisor between 2–10
//         const quotient = Math.floor(getRandomNumber() * 9 + 2)
//         num2 = Math.floor(getRandomNumber() * 9 + 2)
//         num1 = quotient * num2
//       }
  
//       if (id == 3) {
//         if (i < 10) {
//           // quotient: 10–99, divisor: 2–10
//           const quotient = Math.floor(getRandomNumber() * 90 + 10)
//           num2 = Math.floor(getRandomNumber() * 9 + 2)
//           num1 = quotient * num2
//         } else {
//           // quotient and divisor between 2–10
//           const quotient = Math.floor(getRandomNumber() * 9 + 2)
//           num2 = Math.floor(getRandomNumber() * 9 + 2)
//           num1 = quotient * num2
//         }
//       }
  
//       if (id == 4) {
//         if (i < 5) {
//           // quotient and divisor between 2–10
//           const quotient = Math.floor(getRandomNumber() * 9 + 2)
//           num2 = Math.floor(getRandomNumber() * 9 + 2)
//           num1 = quotient * num2
//         } else {
//           // quotient: 10–99, divisor: 2–10
//           const quotient = Math.floor(getRandomNumber() * 90 + 10)
//           num2 = Math.floor(getRandomNumber() * 9 + 2)
//           num1 = quotient * num2
//         }
//       }
  
//       if (id == 5) {
//         // quotient: 10–99, divisor: 2–10
//         const quotient = Math.floor(getRandomNumber() * 90 + 10)
//         num2 = Math.floor(getRandomNumber() * 9 + 2)
//         num1 = quotient * num2
//       }
  
//       levels.push({
//         level: i + 1,
//         numbers: [num1, num2],
//         correctAns: num1 / num2,
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
//   }, [timesup])

//   return (
//     <>
//       <h1 className="main-heading">Basic Division</h1>
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
//       <div className="division-cards-container">
//         {levels.map((level, index) => (
//           <div key={level.level} className="division-card">
//             <div className="division-card-sr-num">
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
//                 {level.numbers[0].toLocaleString()} ÷ {level.numbers[1]} =
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
//       <div className="division-buttons">
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