import { useState, useEffect } from "react"
import { useParams } from "react-router"
import Modal from "../components/Modal"

export default function AbacusQuiz() {
  const { id } = useParams()
  const [levels, setLevels] = useState(() => {
    const savedLevels = localStorage.getItem("abacusQuizProgress")
    return savedLevels ? JSON.parse(savedLevels) : generateLevels(10)
  })
  const [modalMessage, setModalMessage] = useState("") // Message for the modal

  function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1
  }

  function generateLevels(totalLevels) {
    const levelsArray = []
    for (let i = 1; i <= totalLevels; i++) {
      const nums = Array(4)
        .fill(null)
        .map(() => getRandomNumber())
      levelsArray.push({
        level: i,
        numbers: nums,
        correctAns: nums.reduce((sum, num) => sum + num, 0),
        userSolution: "",
        isCorrect: false,
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

  function checkSolution(levelIndex) {
    if (!levels[levelIndex].userSolution) {
      setModalMessage("Please enter a number")
      return
    }
    setLevels((prevLevels) =>
      prevLevels.map((level, index) => {
        if (index === levelIndex) {
          const isCorrect =
            parseInt(level.userSolution, 10) === level.correctAns
          setModalMessage(
            isCorrect
              ? `Good Job, that was correct!`
              : `Try again, that was close!  ${
                  parseInt(level.userSolution, 10) > level.correctAns
                    ? "🔺"
                    : "🔻"
                }`
          )
          return { ...level, isCorrect }
        }
        return level
      })
    )
  }

  // Save progress to localStorage whenever levels change
  useEffect(() => {
    localStorage.setItem("abacusQuizProgress", JSON.stringify(levels))
  }, [levels])

  return (
    <>
      <h1 className="main-heading">Level {id} Mental Practice</h1>
      <div className="box-container">
        {levels.map((level, index) => (
          <div className="box" key={level.level}>
            <div className="boxsm">
              <p>#{level.level}</p>
            </div>
            <div>
              {level.numbers.map((num, idx) => (
                <p key={idx}>{num}</p>
              ))}
            </div>
            <div
              className="boxsm answer-section"
              style={{
                backgroundColor: level.isCorrect ? "lightgreen" : "",
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
                  disabled={level.isCorrect} // Disable input if correct
                />
              </div>
              <button
                onClick={() => checkSolution(index)}
                disabled={level.isCorrect} // Disable button if correct
              >
                Enter
              </button>
            </div>
          </div>
        ))}
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
