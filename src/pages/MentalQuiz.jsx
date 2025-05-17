import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router"
import Modal from "../components/Modal"
import { TIMER } from "../util"

export default function MentalQuiz() {
  const { id } = useParams()
  const timerRef = useRef(null) // Ref to store the timer ID
  const [levels, setLevels] = useState(() => {
    return generateLevels(15)
  })
  const [modalMessage, setModalMessage] = useState("") // Message for the modal
  const [time, setTime] = useState(TIMER)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timesup, setTimesup] = useState(false)

  function handleTimer() {
    if (isTimerRunning) {
      // Stop the timer
      setTimesup(false)
      clearInterval(timerRef.current)
      timerRef.current = null // Clear the ref
      setIsTimerRunning(false)
      setTime(TIMER) // Reset the time
    } else {
      // Reset levels when starting the timer
      setLevels(generateLevels(15))

      // Clear the modal message when starting the timer again
      setModalMessage("")

      // Start the timer
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
    // getting random numbers based on the level / id
    if (id == "7") return Math.floor(Math.random() * 10) + 1
    if (id == "8") return Math.floor(Math.random() * 10) + 1
    if (id == "9") return Math.floor(Math.random() * 10) + 1
    if (id == "10") return Math.floor(Math.random() * 10) + 1
    if (id == "11") return Math.random()

    return Math.floor(Math.random() * 100) + 1
  }

  function generateLevels(totalLevels) {
    const levelsArray = []
    let numOfProblems

    if (id == "1") numOfProblems = 7
    if (id == "2") numOfProblems = 6
    if (id == "3") numOfProblems = 5
    if (id == "4") numOfProblems = 4
    if (id == "5") numOfProblems = 3
    if (id == "6") numOfProblems = 2
    if (id == "7") numOfProblems = 6
    if (id == "8") numOfProblems = 5
    if (id == "9") numOfProblems = 4
    if (id == "10") numOfProblems = 3
    if (id == "11") numOfProblems = 10

    for (let i = 1; i <= totalLevels; i++) {
      const nums = Array(numOfProblems)
        .fill(null)
        .map(() => {
          // if id == 11 then generate random numbers between 1 and 100 and sometimes with 1 to 9999
          if (id == "11") {
            // return Math.random() > 0.8
            //   ? (getRandomNumber() * 99).toFixed(2)
            //   : getRandomNumber().toFixed(2)


            if (Math.random() > 0.60) {
              return (getRandomNumber() * 9000 + 1000).toFixed(2)
            } else if (Math.random() > 0.4) {
              return (getRandomNumber() * 900 + 100).toFixed(2)
            } else {
              return (getRandomNumber() * 90 + 10).toFixed(2)
            }
          }
          return Math.random() > 0.7 ? -getRandomNumber() : getRandomNumber()
        })

      let sum = nums.reduce((acc, num) => acc + num, 0)

      // Adjust the last number if the sum is negative
      if (sum < 0) {
        nums[nums.length - 1] += Math.abs(sum)
        sum = nums.reduce((acc, num) => acc + num, 0) // Recalculate to ensure it's positive
      }

      levelsArray.push({
        level: i,
        numbers: nums,
        correctAns: sum, // The final sum should always be positive
        userSolution: "",
        isCorrect: null, // Use `null` to indicate unattempted levels
      })
    }

    return levelsArray
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
      <h1 className="main-heading">{id == "11" ? 'Advanced Level (Addition)' : `Level ${id} Mental Practice`}</h1>
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
      </div>
      <div className="box-container">
        {levels.map((level, index) => (
          <div className="box card" key={level.level}>
            <div className="boxsm">
              <p>#{level.level}</p>
            </div>
            <div>
              {level.numbers.map((num, idx) => (
                <p
                  style={{
                    fontSize: id == "11" ? "0.8rem" : "1.2rem",
                    textAlign: id == "11" ? "right" : "center",
                    letterSpacing: id == "11" ? "1px" : "0px",
                  }}
                  key={idx}
                >
                  {num}
                </p>
              ))}
            </div>
            <div
              className="boxsm answer-section"
              style={{
                backgroundColor:
                  level.isCorrect === null
                    ? "white" // Default white for unattempted levels
                    : level.isCorrect
                      ? "lightgreen" // Green for correct answers
                      : "lightcoral", // Red for wrong or empty answers
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <input
                  style={{
                    width: "80px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                    padding: "5px",
                  }}
                  value={level.userSolution}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  type="number"
                  placeholder="Answer"
                  disabled={level.isCorrect || !isTimerRunning} // Disable input if already evaluated
                />
              </div>
            </div>
          </div>
        ))}
        <div>
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
            onClick={() => setLevels(generateLevels(15))}
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
      </div>

      {/* Render the modal */}
      {modalMessage && (
        <Modal
          message={modalMessage}
          onClose={() => setModalMessage("")} // Close the modal
        />
      )}
    </>
  )
}
