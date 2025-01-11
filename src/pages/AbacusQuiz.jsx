import { useState } from "react"
import { useParams } from "react-router"

export default function AbacusQuiz() {
  const { id } = useParams()
  const [levels, setLevels] = useState(generateLevels(10)) // Dynamically generate levels

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
        userSolution: "", // Independent user input for each level
        isCorrect: false, // Tracks if the answer is correct
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
    setLevels((prevLevels) =>
      prevLevels.map((level, index) => {
        if (index === levelIndex) {
          const isCorrect =
            parseInt(level.userSolution, 10) === level.correctAns
          if (isCorrect) {
            alert("Good Job, that was correct!")
          } else {
            alert("Try again, it was close!")
          }
          return { ...level, isCorrect }
        }
        return level
      })
    )
  }

  return (
    <>
      <h1 className="main-heading">Level {id} Mental Practice</h1>
      <div className="box-container">
        {levels.map((level, index) => (
          <div className="box" key={level.level}>
            <div className="boxsm">
              <p>{level.level}</p>
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
    </>
  )
}
