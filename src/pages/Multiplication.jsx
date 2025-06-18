import { useState, useEffect, useRef } from "react"
import { TIMER } from "../util"
import Modal from "../components/Modal"
import "./Multiplication.css"

export default function Multiplication() {
  const timerRef = useRef(null) // Ref to store the timer ID
  const [levels, setLevels] = useState(() => {
    return generateLevels(40)
  })

  console.log("levels", levels)
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
      setLevels(generateLevels(40))
      setModalMessage("")
      setScore(0)
      setTimesup(false)
      setIsSubmitted(false)
      setIsTimerRunning(true)
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
    setIsSubmitted(false)
    setLevels(generateLevels(40))
    setModalMessage('')
  }

  function getRandomNumber() {
    return Math.random()
  }

  function generateLevels(totalLevels) {
    const levels = []
    let numbers = []
    for (let i = 0; i < totalLevels; i++) {
      const twoDigitRandomNum = Math.floor(getRandomNumber() *90 + 10)
      const threeDigitRandomNum = Math.floor(getRandomNumber() * 900 + 100)
      if (getRandomNumber() > 0.5) {
        // Swap the numbers randomly
        numbers = [threeDigitRandomNum, twoDigitRandomNum]
      } else {
        numbers = [twoDigitRandomNum, threeDigitRandomNum]
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
      prevLevels.map((level, index) =>
        index === levelIndex ? { ...level, userSolution: value } : level
      )
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

    setIsSubmitted(true) // Mark as submitted

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

  function practiceMode() {
    // Reset all answers to allow practice but keep the same problems
    setLevels((prevLevels) =>
      prevLevels.map((level) => ({
        ...level,
        userSolution: "",
        isCorrect: null
      }))
    )
    setScore(0)
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
  }, [timesup])

  return (
    <>
      <h1 className="main-heading">Advanced Level (Multiplication)</h1>
      {/* Quiz Timer */}
      <div className="quiz-timer">
        {(isTimerRunning || isTimerPaused) && (
          <h2>
            Time Remaining: {Math.floor(time / 60)} minutes{" "}
            {String(time % 60).padStart(2, "0")} seconds
            {isTimerPaused && <span style={{ color: 'red', marginLeft: '10px' }}>(PAUSED)</span>}
          </h2>
        )}
        {isSubmitted && !isTimerRunning && !isTimerPaused && (
          <h2 style={{ color: '#4CAF50' }}>Practice Mode - No Timer</h2>
        )}
        <h3>Score: {score} / 40</h3>
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
        {isSubmitted && (
          <button
            onClick={practiceMode}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginLeft: '10px',
              marginTop: '20px',
            }}
          >
            Practice Again
          </button>
        )}
        {/* Show level achived */}
        {levelAchieved && <h1> Level Achieved: {levelAchieved}</h1>}
      </div>
      <div className="multiplication-cards-container">
        {levels.map((level, index) => (
          <div 
            key={level.level} 
            className="multiplication-card"
            style={{ 
              filter: isTimerPaused ? 'blur(5px)' : 'none',
              transition: 'filter 0.3s ease'
            }}
          >
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
                disabled={isTimerPaused} // Only disable when timer is paused, allow input after submission for practice
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
          {isSubmitted ? 'Check Again' : 'Submit'}
        </button>
        <button
          onClick={() => {
            setLevels(generateLevels(40))
            setIsSubmitted(false)
            setScore(0)
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
// import { TIMER } from "../util"
// import Modal from "../components/Modal"
// import "./Multiplication.css"

// export default function Multiplication() {
//   const timerRef = useRef(null) // Ref to store the timer ID
//   const [levels, setLevels] = useState(() => {
//     return generateLevels(40)
//   })

//   console.log("levels", levels)
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
//       setLevels(generateLevels(40)) // Reset levels
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
//     const levels = []
//     let numbers = []
//     for (let i = 0; i < totalLevels; i++) {
//       const twoDigitRandomNum = Math.floor(getRandomNumber() *90 + 10)
//       const threeDigitRandomNum = Math.floor(getRandomNumber() * 900 + 100)
//       if (getRandomNumber() > 0.5) {
//         // Swap the numbers randomly
//         numbers = [threeDigitRandomNum, twoDigitRandomNum]
//       } else {
//         numbers = [twoDigitRandomNum, threeDigitRandomNum]
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
//   }, [timesup])
//   // useEffect(() => {
//   //   if (timesup) {
//   //     // Clear the timer when time's up
//   //     clearInterval(timerRef.current);
//   //     timerRef.current = null;
//   //     // reset the timer

//   //     // submit the answers when time is up
//   //     checkSolution();
//   //   }
//   // }, [timesup]);

//   return (
//     <>
//       <h1 className="main-heading">Advanced Level (Multiplication)</h1>
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
//                 // backgroundColor:
//                 //   level.userSolution === "" // Default white for unattempted levels
//                 //     ? "white"
//                 //     : level.isCorrect
//                 //     ? "lightgreen" // Green for correct answers
//                 //     : "lightcoral", // Red for wrong answers

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
//           onClick={() => setLevels(generateLevels(40))}
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
