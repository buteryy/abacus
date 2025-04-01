import { useState, useEffect, useRef } from "react"

import Modal from "../components/Modal"
import "./Multiplication.css"

export default function Division() {
  const timerRef = useRef(null) // Ref to store the timer ID
  const [levels, setLevels] = useState(() => {
    return generateLevels(40)
  })

  const [modalMessage, setModalMessage] = useState("") // Message for the modal
  const [time, setTime] = useState()
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timesup, setTimesup] = useState(false)

  function handleTimer() {
    if (isTimerRunning) {
      // Stop the timer
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsTimerRunning(false)
      setTimesup(false)
      setTime(5 * 60) // Reset the time
    } else {
      // Reset states when starting the timer
      setTimesup(false)
      setLevels(generateLevels(40)) // Reset levels
      setModalMessage("") // Clear modal message
      setTime(10) // Reset time

      // Start the timer after resetting the time
      setIsTimerRunning(true)
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timerRef.current) // Clear the timer
            timerRef.current = null
            setIsTimerRunning(false)
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
    const levels = []
    let numbers = []
    for (let i = 0; i < totalLevels; i++) {
      // num1 larger than num2, 5 digits number
      const num1 = Math.floor(getRandomNumber() * 10000 + 10000)
      // num2, 2 digits or 3 digits number
      // const num2 = Math.floor(getRandomNumber() * 10 + 1)
      let num2 = 0
      if (getRandomNumber() > 0.5) {
        num2 = Math.floor(getRandomNumber() *90 + 10)
      } else {
        num2 = Math.floor(getRandomNumber() * 900 + 100)
      }
      
      // perfet division
      if (num1 % num2 !== 0) {
        i--
        continue
      }

      numbers = [num1, num2]
      const correctAns = numbers[0] / numbers[1]
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
      // reset the timer
      setTime(5 * 60)
      // submit the answers when time is up
      checkSolution()
    }
  }, [timesup])

  return (
    <>
      <h1 className="main-heading">Advanced Level (Division)</h1>
      {/* Quiz Timer */}
      <div className="quiz-timer">
        {isTimerRunning && (
          <h2>
            Time Remaining: {Math.floor(time / 60)} minutes{" "}
            {String(time % 60).padStart(2, "0")} seconds
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
          {isTimerRunning ? "Stop & Reset Timer" : "Start Timer"}
        </button>
        {/* Show level achived */}
        {levelAchieved && <h1> Level Achieved: {levelAchieved}</h1>}
      </div>
      <div className="multiplication-cards-container">
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
                {level.numbers[0].toLocaleString()} <span style={{
                  fontSize: "20px"
                }}>÷</span> {level.numbers[1]} =
              </span>
              <input
                value={level.userSolution}
                onChange={(e) => handleInputChange(index, +e.target.value)}
                type="number"
                placeholder="Answer"
                disabled={level.isCorrect || !isTimerRunning} // Disable input if already evaluated
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
          onClick={() => setLevels(generateLevels(40))}
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
