import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router"
import Modal from "../components/Modal"
import "./Multiplication.css"

export default function Multiplication() {
  const timerRef = useRef(null); // Ref to store the timer ID
  const [levels, setLevels] = useState(() => {
    return generateLevels(40)
  })
  const [modalMessage, setModalMessage] = useState("") // Message for the modal
  const [time, setTime] = useState(5 * 60) // 5 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timesup, setTimesup] = useState(false)

  function handleTimer() {
    if (isTimerRunning) {
      // Stop the timer
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsTimerRunning(false);
      setTimesup(false);
      setTime(5 * 60); // Reset the time
    } else {
      // Reset states when starting the timer
      setTimesup(false);
      setLevels(generateLevels(40)); // Reset levels
      setModalMessage(""); // Clear modal message
      setTime(5 * 60); // Reset time
  
      // Start the timer after resetting the time
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timerRef.current); // Clear the timer
            timerRef.current = null;
            setIsTimerRunning(false);
            setTimesup(true);
            setModalMessage("Time's up! Please revise your answers.");
            return 0; // Stop at 0
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  }

  function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1
  }

  function generateLevels(totalLevels) {
    const levels = []
    for (let i = 0; i < totalLevels; i++) {
      const numbers = [getRandomNumber(), getRandomNumber()]
      const correctAns = numbers[0] * numbers[1]
      levels.push({
        level: i + 1,
        numbers,
        correctAns,
        userSolution: "",
        isCorrect: false,
      })
    }
    return levels;
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
  // useEffect(() => {
  //   if (timesup) {
  //     // Clear the timer when time's up
  //     clearInterval(timerRef.current);
  //     timerRef.current = null;
  //     // reset the timer

  //     // submit the answers when time is up
  //     checkSolution();
  //   }
  // }, [timesup]);

  return (
    <>
      <h1 className="main-heading">Advanced Level (Multiplication)</h1>
      {/* Quiz Timer */}
      <div className="quiz-timer">
      {isTimerRunning && <h2>
          Time Remaining: {Math.floor(time / 60)} minutes {String(time % 60).padStart(2, '0')} seconds
      </h2>}
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
          cursor: "pointer"
        }}>
          {isTimerRunning ? "Stop & Reset Timer" : "Start Timer"}
        </button>
        {/* Show level achived */}
        <h1> Level Achieved: {levelAchieved}</h1>
      </div>
      <div className="multiplication-cards-container">
        {levels.map((level, index) => (
          <div key={level.level} className="multiplication-card">
            <div className="multiplication-card-sr-num">{index < 9 ? `0${index + 1}` : index + 1}</div>
            <div className="quiz-numbers-and-input" style={{
               backgroundColor:
               level.userSolution === "" // Default white for unattempted levels
                 ? "white"
                 : level.isCorrect
                 ? "lightgreen" // Green for correct answers
                 : "lightcoral", // Red for wrong answers
            }}>
               <span key={index}>{ level.numbers[0]} x {level.numbers[1]} =</span>
               <input
                value={level.userSolution}
                onChange={(e) => handleInputChange(index, e.target.value)}
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



