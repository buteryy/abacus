import { useState } from "react"
import { useParams } from "react-router"

export default function AbacusQuiz() {
  const { id } = useParams()
  const [userSolution, setUserSolution] = useState(null)
  const [randomNums, setRandomNums] = useState({
    num1: getRandomNumber(),
    num2: getRandomNumber(),
    num3: getRandomNumber(),
    num4: getRandomNumber(),
  })

  function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1
  }

  function checkSolution() {
    const { num1, num2, num3, num4 } = randomNums
    const correctAns = num1 + num2 + num3 + num4
    if (correctAns == userSolution) {
      alert("Good Job, that was correct!")
    } else {
      alert("Try again, it was close!")
    }
  }

  return (
    <>
      <h1 className="main-heading">Level {id} Mental Practice</h1>

      <div className="box-container">
        <div className="box">
          <div className="boxsm">
            <p>1</p>
          </div>
          <div>
            <p>{randomNums.num1}</p>
            <p>{randomNums.num2}</p>
            <p>{randomNums.num3}</p>
            <p>{randomNums.num4}</p>
          </div>
          <div className="boxsm answer-section">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>Ans:</p>
              <input
                style={{
                  width: "50px",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                  borderRadius: "10px",
                  padding: "2px",
                }}
                onChange={(e) => setUserSolution(e.target.value)}
                type="number"
                placeholder="07"
              />
            </div>
            <button onClick={checkSolution}>Enter</button>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>2</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>3</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>4</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>5</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>6</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>7</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>8</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>9</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>10</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>11</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>

        <div className="box">
          <div className="boxsm">
            <p>12</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>

        <div className="box">
          <div className="boxsm">
            <p>13</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>

        <div className="box">
          <div className="boxsm">
            <p>14</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
        <div className="box">
          <div className="boxsm">
            <p>15</p>
          </div>
          <div>
            <p>42</p>
            <p>87</p>
            <p>98</p>
            <p>36</p>
          </div>
          <div className="boxsm answer-section">
            <p>Ans:</p>
            <p>234</p>
          </div>
        </div>
      </div>
    </>
  )
}
