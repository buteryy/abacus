import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import Modal from '../components/Modal'
import { generateRandomNumber, getNumOfProblems, TIMER } from '../util'

export default function AbacusQuiz() {
  const { id } = useParams()
  const timerRef = useRef(null) // Ref to store the timer ID
  const [levels, setLevels] = useState(() => {
    return generateLevels(15)
  })
  const [modalMessage, setModalMessage] = useState('') // Message for the modal
  const [time, setTime] = useState(TIMER)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isTimerPaused, setIsTimerPaused] = useState(false)
  const [timesup, setTimesup] = useState(false)
  const [score, setScore] = useState(0) // Score counter
  const [isSubmitted, setIsSubmitted] = useState(false) // Track if quiz has been submitted

  function handleTimer() {
    if (!isTimerRunning && !isTimerPaused) {
      // Start the timer for the first time
      setLevels(generateLevels(15))
      setModalMessage('')
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
    setLevels(generateLevels(15))
    setModalMessage('')
  }

  function getRandomNumber() {
    // getting random numbers based on the level / id
    if (id == '1') {
      if (Math.random() > 0.6) return generateRandomNumber(4)
      else if (Math.random() > 0.5) return generateRandomNumber(3)
      else return generateRandomNumber(2)
    }
    if (id == '2') return generateRandomNumber(3)
    if (id == '3') return generateRandomNumber(3)
    if (id == '4') return generateRandomNumber(2)
    if (id == '5') return generateRandomNumber(2)
    if (id == '6') return generateRandomNumber(2)
    if (id == '7') return generateRandomNumber(1)
    if (id == '8') return generateRandomNumber(1)
    if (id == '9') return generateRandomNumber(1)
    if (id == '10') return generateRandomNumber(1)
    if (id == '11') {
      if (Math.random() > 0.6)
        return (generateRandomNumber(4) + Math.random()).toFixed(2)
      else if (Math.random() > 0.4)
        return (generateRandomNumber(3) + Math.random()).toFixed(2)
      else return (generateRandomNumber(2) + Math.random()).toFixed(2)
    }

    return generateRandomNumber(2)
  }

  function generateLevels(totalLevels) {
    const levelsArray = []
    let numOfProblems = getNumOfProblems(id)

    for (let i = 1; i <= totalLevels; i++) {
      const nums = Array(numOfProblems)
        .fill(null)
        .map(() => {
          return Math.random() > 0.9
            ? getRandomNumber() * -1
            : getRandomNumber()
        })

      let sum = nums.reduce((acc, num) => acc + num, 0)

      if (sum < 0) console.log(sum)

      levelsArray.push({
        level: i,
        numbers: nums,
        correctAns: sum,
        userSolution: '',
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
          level.userSolution === '' // Empty answers
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
        userSolution: '',
        isCorrect: null
      }))
    )
    setScore(0)
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
      <h1 className="main-heading">
        {id == '11'
          ? 'Advanced Level (Addition)'
          : `Level ${id} Mental Practice`}
      </h1>
      {/* Quiz Timer */}
      <div className="quiz-timer">
        {(isTimerRunning || isTimerPaused) && (
          <h2>
            Time Remaining: {Math.floor(time / 60)} minutes{' '}
            {String(time % 60).padStart(2, '0')} seconds
            {isTimerPaused && <span style={{ color: 'red', marginLeft: '10px' }}>(PAUSED)</span>}
          </h2>
        )}
        {isSubmitted && !isTimerRunning && !isTimerPaused && (
          <h2 style={{ color: '#4CAF50' }}>Practice Mode - No Timer</h2>
        )}
        <h3>Score: {score} / 15</h3>
        <button
          onClick={handleTimer}
          style={{
            padding: '10px 20px',
            backgroundColor: isTimerPaused ? '#FF9800' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px',
            marginTop: '20px',
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
      </div>
      <div className="box-container">
        {levels.map((level, index) => (
          <div
            className="box card"
            style={{ 
              height: 'fit-content',
              filter: isTimerPaused ? 'blur(5px)' : 'none',
              transition: 'filter 0.3s ease'
            }}
            key={level.level}
          >
            <div className="boxsm">
              <p>#{level.level}</p>
            </div>
            <div>
              {level.numbers.map((num, idx) => (
                <p
                  style={{
                    fontSize: id == '11' ? '0.8rem' : '1.2rem',
                    textAlign: 'right',
                    letterSpacing: id == '11' ? '1px' : '0px',
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
                    ? 'white' // Default white for unattempted levels
                    : level.isCorrect
                    ? 'lightgreen' // Green for correct answers
                    : 'lightcoral', // Red for wrong or empty answers
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <input
                  style={{
                    width: '80px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    backgroundColor: 'transparent',
                    borderRadius: '10px',
                    padding: '5px',
                  }}
                  value={level.userSolution}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  type="number"
                  placeholder="Answer"
                  disabled={isTimerPaused} // Only disable when timer is paused, allow input after submission for practice
                />
              </div>
            </div>
          </div>
        ))}
        <div>
          <button
            onClick={checkSolution}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            {isSubmitted ? 'Check Again' : 'Submit'}
          </button>
          <button
            onClick={() => {
              setLevels(generateLevels(15))
              setIsSubmitted(false)
              setScore(0)
            }}
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
            Clear All
          </button>
        </div>
      </div>

      {/* Render the modal */}
      {modalMessage && (
        <Modal
          message={modalMessage}
          onClose={() => setModalMessage('')} // Close the modal
        />
      )}
    </>
  )
}

// import { useState, useEffect, useRef } from 'react'
// import { useParams } from 'react-router'
// import Modal from '../components/Modal'
// import { generateRandomNumber, getNumOfProblems, TIMER } from '../util'

// export default function AbacusQuiz() {
//   const { id } = useParams()
//   const timerRef = useRef(null) // Ref to store the timer ID
//   const [levels, setLevels] = useState(() => {
//     return generateLevels(15)
//   })
//   const [modalMessage, setModalMessage] = useState('') // Message for the modal
//   const [time, setTime] = useState(TIMER)
//   const [isTimerRunning, setIsTimerRunning] = useState(false)
//   const [isTimerPaused, setIsTimerPaused] = useState(false)
//   const [timesup, setTimesup] = useState(false)
//   const [score, setScore] = useState(0) // Score counter

//   function handleTimer() {
//     if (!isTimerRunning && !isTimerPaused) {
//       // Start the timer for the first time
//       setLevels(generateLevels(15))
//       setModalMessage('')
//       setScore(0)
//       setTimesup(false)
//       setIsTimerRunning(true)
//       setIsTimerPaused(false)
      
//       timerRef.current = setInterval(() => {
//         setTime((prevTime) => {
//           if (prevTime === 0) {
//             clearInterval(timerRef.current)
//             timerRef.current = null
//             setIsTimerRunning(false)
//             setIsTimerPaused(false)
//             setTimesup(true)
//             setModalMessage("Time's up! Please revise your answers.")
//             return 0
//           }
//           return prevTime - 1
//         })
//       }, 1000)
//     } else if (isTimerRunning && !isTimerPaused) {
//       // Pause the timer
//       clearInterval(timerRef.current)
//       timerRef.current = null
//       setIsTimerPaused(true)
//     } else if (isTimerPaused) {
//       // Continue the timer
//       setIsTimerPaused(false)
//       timerRef.current = setInterval(() => {
//         setTime((prevTime) => {
//           if (prevTime === 0) {
//             clearInterval(timerRef.current)
//             timerRef.current = null
//             setIsTimerRunning(false)
//             setIsTimerPaused(false)
//             setTimesup(true)
//             setModalMessage("Time's up! Please revise your answers.")
//             return 0
//           }
//           return prevTime - 1
//         })
//       }, 1000)
//     }
//   }

//   function resetTimer() {
//     clearInterval(timerRef.current)
//     timerRef.current = null
//     setIsTimerRunning(false)
//     setIsTimerPaused(false)
//     setTime(TIMER)
//     setScore(0)
//     setTimesup(false)
//     setLevels(generateLevels(15))
//     setModalMessage('')
//   }

//   function getRandomNumber() {
//     // getting random numbers based on the level / id
//     if (id == '1') {
//       if (Math.random() > 0.6) return generateRandomNumber(4)
//       else if (Math.random() > 0.5) return generateRandomNumber(3)
//       else return generateRandomNumber(2)
//     }
//     if (id == '2') return generateRandomNumber(3)
//     if (id == '3') return generateRandomNumber(3)
//     if (id == '4') return generateRandomNumber(2)
//     if (id == '5') return generateRandomNumber(2)
//     if (id == '6') return generateRandomNumber(2)
//     if (id == '7') return generateRandomNumber(1)
//     if (id == '8') return generateRandomNumber(1)
//     if (id == '9') return generateRandomNumber(1)
//     if (id == '10') return generateRandomNumber(1)
//     if (id == '11') {
//       if (Math.random() > 0.6)
//         return (generateRandomNumber(4) + Math.random()).toFixed(2)
//       else if (Math.random() > 0.4)
//         return (generateRandomNumber(3) + Math.random()).toFixed(2)
//       else return (generateRandomNumber(2) + Math.random()).toFixed(2)
//     }

//     return generateRandomNumber(2)
//   }

//   function generateLevels(totalLevels) {
//     const levelsArray = []
//     let numOfProblems = getNumOfProblems(id)

//     for (let i = 1; i <= totalLevels; i++) {
//       const nums = Array(numOfProblems)
//         .fill(null)
//         .map(() => {
//           return Math.random() > 0.9
//             ? getRandomNumber() * -1
//             : getRandomNumber()
//         })

//       let sum = nums.reduce((acc, num) => acc + num, 0)

//       if (sum < 0) console.log(sum)

//       levelsArray.push({
//         level: i,
//         numbers: nums,
//         correctAns: sum,
//         userSolution: '',
//         isCorrect: null, // Use `null` to indicate unattempted levels
//       })
//     }

//     return levelsArray
//   }

//   function handleInputChange(levelIndex, value) {
//     setLevels((prevLevels) =>
//       prevLevels.map((level, index) =>
//         index === levelIndex ? { ...level, userSolution: value } : level
//       )
//     )
//   }

//   function checkSolution() {
//     // Stop the timer when submitting
//     if (isTimerRunning) {
//       clearInterval(timerRef.current)
//       timerRef.current = null
//       setIsTimerRunning(false)
//       setIsTimerPaused(false)
//     }

//     setLevels((prevLevels) => {
//       const updatedLevels = prevLevels.map((level) => {
//         const isCorrect =
//           level.userSolution === '' // Empty answers
//             ? false
//             : parseInt(level.userSolution, 10) === level.correctAns
//         return { ...level, isCorrect }
//       })
      
//       // Calculate and update score
//       const correctCount = updatedLevels.filter(level => level.isCorrect === true).length
//       setScore(correctCount)
      
//       return updatedLevels
//     })
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
//       <h1 className="main-heading">
//         {id == '11'
//           ? 'Advanced Level (Addition)'
//           : `Level ${id} Mental Practice`}
//       </h1>
//       {/* Quiz Timer */}
//       <div className="quiz-timer">
//         {(isTimerRunning || isTimerPaused) && (
//           <h2>
//             Time Remaining: {Math.floor(time / 60)} minutes{' '}
//             {String(time % 60).padStart(2, '0')} seconds
//             {isTimerPaused && <span style={{ color: 'red', marginLeft: '10px' }}>(PAUSED)</span>}
//           </h2>
//         )}
//         <h3>Score: {score} / 15</h3>
//         <button
//           onClick={handleTimer}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: isTimerPaused ? '#FF9800' : '#4CAF50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             marginLeft: '10px',
//             marginTop: '20px',
//           }}
//         >
//           {!isTimerRunning && !isTimerPaused 
//             ? 'Start Timer' 
//             : isTimerPaused 
//             ? 'Continue' 
//             : 'Pause'}
//         </button>
//         {(isTimerRunning || isTimerPaused) && (
//           <button
//             onClick={resetTimer}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#f44336',
//               color: 'white',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//               marginLeft: '10px',
//               marginTop: '20px',
//             }}
//           >
//             Reset Timer
//           </button>
//         )}
//       </div>
//       <div className="box-container">
//         {levels.map((level, index) => (
//           <div
//             className="box card"
//             style={{ 
//               height: 'fit-content',
//               filter: isTimerPaused ? 'blur(5px)' : 'none',
//               transition: 'filter 0.3s ease'
//             }}
//             key={level.level}
//           >
//             <div className="boxsm">
//               <p>#{level.level}</p>
//             </div>
//             <div>
//               {level.numbers.map((num, idx) => (
//                 <p
//                   style={{
//                     fontSize: id == '11' ? '0.8rem' : '1.2rem',
//                     textAlign: 'right',
//                     letterSpacing: id == '11' ? '1px' : '0px',
//                   }}
//                   key={idx}
//                 >
//                   {num}
//                 </p>
//               ))}
//             </div>
//             <div
//               className="boxsm answer-section"
//               style={{
//                 backgroundColor:
//                   level.isCorrect === null
//                     ? 'white' // Default white for unattempted levels
//                     : level.isCorrect
//                     ? 'lightgreen' // Green for correct answers
//                     : 'lightcoral', // Red for wrong or empty answers
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 flexDirection: 'column',
//                 gap: '10px',
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   flexDirection: 'column',
//                 }}
//               >
//                 <input
//                   style={{
//                     width: '80px',
//                     fontWeight: 'bold',
//                     fontSize: '1.1rem',
//                     backgroundColor: 'transparent',
//                     borderRadius: '10px',
//                     padding: '5px',
//                   }}
//                   value={level.userSolution}
//                   onChange={(e) => handleInputChange(index, e.target.value)}
//                   type="number"
//                   placeholder="Answer"
//                   disabled={level.isCorrect || !isTimerRunning || isTimerPaused} // Disable input if already evaluated or timer not running or paused
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//         <div>
//           <button
//             onClick={checkSolution}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//               marginTop: '20px',
//             }}
//           >
//             Submit
//           </button>
//           <button
//             onClick={() => setLevels(generateLevels(15))}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#f44336',
//               color: 'white',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//               marginLeft: '10px',
//               marginTop: '20px',
//             }}
//           >
//             Clear All
//           </button>
//         </div>
//       </div>

//       {/* Render the modal */}
//       {modalMessage && (
//         <Modal
//           message={modalMessage}
//           onClose={() => setModalMessage('')} // Close the modal
//         />
//       )}
//     </>
//   )
// }

// // quiz pause and score feature

// // import { useState, useEffect, useRef } from 'react'
// // import { useParams } from 'react-router'
// // import Modal from '../components/Modal'
// // import { generateRandomNumber, getNumOfProblems, TIMER } from '../util'

// // export default function AbacusQuiz() {
// //   const { id } = useParams()
// //   const timerRef = useRef(null) // Ref to store the timer ID
// //   const [levels, setLevels] = useState(() => {
// //     return generateLevels(15)
// //   })
// //   const [modalMessage, setModalMessage] = useState('') // Message for the modal
// //   const [time, setTime] = useState(TIMER)
// //   const [isTimerRunning, setIsTimerRunning] = useState(false)
// //   const [timesup, setTimesup] = useState(false)
// //   const [score, setScore] = useState(0) // Score counter

// //   function handleTimer() {
// //     if (isTimerRunning) {
// //       // Stop the timer
// //       setTimesup(false)
// //       clearInterval(timerRef.current)
// //       timerRef.current = null // Clear the ref
// //       setIsTimerRunning(false)
// //       setTime(TIMER) // Reset the time
// //     } else {
// //       // Reset levels when starting the timer
// //       setLevels(generateLevels(15))

// //       // Clear the modal message when starting the timer again
// //       setModalMessage('')

// //       // Reset score when starting the timer
// //       setScore(0)

// //       // Start the timer
// //       setIsTimerRunning(true)
// //       timerRef.current = setInterval(() => {
// //         setTime((prevTime) => {
// //           if (prevTime === 0) {
// //             clearInterval(timerRef.current) // Clear the timer
// //             timerRef.current = null
// //             setIsTimerRunning(false)
// //             setTimesup(true)
// //             setModalMessage("Time's up! Please revise your answers.")
// //             return 0 // Stop at 0
// //           }
// //           return prevTime - 1
// //         })
// //       }, 1000)
// //     }
// //   }

// //   function getRandomNumber() {
// //     // getting random numbers based on the level / id
// //     if (id == '1') {
// //       if (Math.random() > 0.6) return generateRandomNumber(4)
// //       else if (Math.random() > 0.5) return generateRandomNumber(3)
// //       else return generateRandomNumber(2)
// //     }
// //     if (id == '2') return generateRandomNumber(3)
// //     if (id == '3') return generateRandomNumber(3)
// //     if (id == '4') return generateRandomNumber(2)
// //     if (id == '5') return generateRandomNumber(2)
// //     if (id == '6') return generateRandomNumber(2)
// //     if (id == '7') return generateRandomNumber(1)
// //     if (id == '8') return generateRandomNumber(1)
// //     if (id == '9') return generateRandomNumber(1)
// //     if (id == '10') return generateRandomNumber(1)
// //     if (id == '11') {
// //       if (Math.random() > 0.6)
// //         return (generateRandomNumber(4) + Math.random()).toFixed(2)
// //       else if (Math.random() > 0.4)
// //         return (generateRandomNumber(3) + Math.random()).toFixed(2)
// //       else return (generateRandomNumber(2) + Math.random()).toFixed(2)
// //     }

// //     return generateRandomNumber(2)
// //   }

// //   function generateLevels(totalLevels) {
// //     const levelsArray = []
// //     let numOfProblems = getNumOfProblems(id)

// //     for (let i = 1; i <= totalLevels; i++) {
// //       const nums = Array(numOfProblems)
// //         .fill(null)
// //         .map(() => {
// //           return Math.random() > 0.9
// //             ? getRandomNumber() * -1
// //             : getRandomNumber()
// //         })

// //       let sum = nums.reduce((acc, num) => acc + num, 0)

// //       if (sum < 0) console.log(sum)

// //       levelsArray.push({
// //         level: i,
// //         numbers: nums,
// //         correctAns: sum,
// //         userSolution: '',
// //         isCorrect: null, // Use `null` to indicate unattempted levels
// //       })
// //     }

// //     return levelsArray
// //   }

// //   function handleInputChange(levelIndex, value) {
// //     setLevels((prevLevels) =>
// //       prevLevels.map((level, index) =>
// //         index === levelIndex ? { ...level, userSolution: value } : level
// //       )
// //     )
// //   }

// //   function checkSolution() {
// //     setLevels((prevLevels) => {
// //       const updatedLevels = prevLevels.map((level) => {
// //         const isCorrect =
// //           level.userSolution === '' // Empty answers
// //             ? false
// //             : parseInt(level.userSolution, 10) === level.correctAns
// //         return { ...level, isCorrect }
// //       })
      
// //       // Calculate and update score
// //       const correctCount = updatedLevels.filter(level => level.isCorrect === true).length
// //       setScore(correctCount)
      
// //       return updatedLevels
// //     })
// //   }

// //   useEffect(() => {
// //     if (timesup) {
// //       // Clear the timer when time's up
// //       clearInterval(timerRef.current)
// //       timerRef.current = null
// //       // reset the timer
// //       setTime(TIMER)
// //       // submit the answers when time is up
// //       checkSolution()
// //     }
// //   }, [timesup])

// //   return (
// //     <>
// //       <h1 className="main-heading">
// //         {id == '11'
// //           ? 'Advanced Level (Addition)'
// //           : `Level ${id} Mental Practice`}
// //       </h1>
// //       {/* Quiz Timer */}
// //       <div className="quiz-timer">
// //         {isTimerRunning && (
// //           <h2>
// //             Time Remaining: {Math.floor(time / 60)} minutes{' '}
// //             {String(time % 60).padStart(2, '0')} seconds
// //           </h2>
// //         )}
// //         <h3>Score: {score} / 15</h3>
// //         <button
// //           onClick={handleTimer}
// //           style={{
// //             padding: '10px 20px',
// //             backgroundColor: '#4CAF50',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer',
// //             marginLeft: '10px',
// //             marginTop: '20px',
// //           }}
// //         >
// //           {isTimerRunning ? 'Stop & Reset Timer' : 'Start Timer'}
// //         </button>
// //       </div>
// //       <div className="box-container">
// //         {levels.map((level, index) => (
// //           <div
// //             className="box card"
// //             style={{ height: 'fit-content' }}
// //             key={level.level}
// //           >
// //             <div className="boxsm">
// //               <p>#{level.level}</p>
// //             </div>
// //             <div>
// //               {level.numbers.map((num, idx) => (
// //                 <p
// //                   style={{
// //                     fontSize: id == '11' ? '0.8rem' : '1.2rem',
// //                     textAlign: 'right',
// //                     letterSpacing: id == '11' ? '1px' : '0px',
// //                   }}
// //                   key={idx}
// //                 >
// //                   {num}
// //                 </p>
// //               ))}
// //             </div>
// //             <div
// //               className="boxsm answer-section"
// //               style={{
// //                 backgroundColor:
// //                   level.isCorrect === null
// //                     ? 'white' // Default white for unattempted levels
// //                     : level.isCorrect
// //                     ? 'lightgreen' // Green for correct answers
// //                     : 'lightcoral', // Red for wrong or empty answers
// //                 display: 'flex',
// //                 justifyContent: 'center',
// //                 alignItems: 'center',
// //                 flexDirection: 'column',
// //                 gap: '10px',
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   display: 'flex',
// //                   justifyContent: 'center',
// //                   alignItems: 'center',
// //                   flexDirection: 'column',
// //                 }}
// //               >
// //                 <input
// //                   style={{
// //                     width: '80px',
// //                     fontWeight: 'bold',
// //                     fontSize: '1.1rem',
// //                     backgroundColor: 'transparent',
// //                     borderRadius: '10px',
// //                     padding: '5px',
// //                   }}
// //                   value={level.userSolution}
// //                   onChange={(e) => handleInputChange(index, e.target.value)}
// //                   type="number"
// //                   placeholder="Answer"
// //                   disabled={level.isCorrect || !isTimerRunning} // Disable input if already evaluated
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //         <div>
// //           <button
// //             onClick={checkSolution}
// //             style={{
// //               padding: '10px 20px',
// //               backgroundColor: '#4CAF50',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '5px',
// //               cursor: 'pointer',
// //               marginTop: '20px',
// //             }}
// //           >
// //             Submit
// //           </button>
// //           <button
// //             onClick={() => setLevels(generateLevels(15))}
// //             style={{
// //               padding: '10px 20px',
// //               backgroundColor: '#f44336',
// //               color: 'white',
// //               border: 'none',
// //               borderRadius: '5px',
// //               cursor: 'pointer',
// //               marginLeft: '10px',
// //               marginTop: '20px',
// //             }}
// //           >
// //             Clear All
// //           </button>
// //         </div>
// //       </div>

// //       {/* Render the modal */}
// //       {modalMessage && (
// //         <Modal
// //           message={modalMessage}
// //           onClose={() => setModalMessage('')} // Close the modal
// //         />
// //       )}
// //     </>
// //   )
// // }

// // // import { useState, useEffect, useRef } from 'react'
// // // import { useParams } from 'react-router'
// // // import Modal from '../components/Modal'
// // // import { generateRandomNumber, getNumOfProblems, TIMER } from '../util'

// // // export default function AbacusQuiz() {
// // //   const { id } = useParams()
// // //   const timerRef = useRef(null) // Ref to store the timer ID
// // //   const [levels, setLevels] = useState(() => {
// // //     return generateLevels(15)
// // //   })
// // //   const [modalMessage, setModalMessage] = useState('') // Message for the modal
// // //   const [time, setTime] = useState(TIMER)
// // //   const [isTimerRunning, setIsTimerRunning] = useState(false)
// // //   const [timesup, setTimesup] = useState(false)

// // //   function handleTimer() {
// // //     if (isTimerRunning) {
// // //       // Stop the timer
// // //       setTimesup(false)
// // //       clearInterval(timerRef.current)
// // //       timerRef.current = null // Clear the ref
// // //       setIsTimerRunning(false)
// // //       setTime(TIMER) // Reset the time
// // //     } else {
// // //       // Reset levels when starting the timer
// // //       setLevels(generateLevels(15))

// // //       // Clear the modal message when starting the timer again
// // //       setModalMessage('')

// // //       // Start the timer
// // //       setIsTimerRunning(true)
// // //       timerRef.current = setInterval(() => {
// // //         setTime((prevTime) => {
// // //           if (prevTime === 0) {
// // //             clearInterval(timerRef.current) // Clear the timer
// // //             timerRef.current = null
// // //             setIsTimerRunning(false)
// // //             setTimesup(true)
// // //             setModalMessage("Time's up! Please revise your answers.")
// // //             return 0 // Stop at 0
// // //           }
// // //           return prevTime - 1
// // //         })
// // //       }, 1000)
// // //     }
// // //   }

// // //   function getRandomNumber() {
// // //     // getting random numbers based on the level / id
// // //     if (id == '1') {
// // //       if (Math.random() > 0.6) return generateRandomNumber(4)
// // //       else if (Math.random() > 0.5) return generateRandomNumber(3)
// // //       else return generateRandomNumber(2)
// // //     }
// // //     if (id == '2') return generateRandomNumber(3)
// // //     if (id == '3') return generateRandomNumber(3)
// // //     if (id == '4') return generateRandomNumber(2)
// // //     if (id == '5') return generateRandomNumber(2)
// // //     if (id == '6') return generateRandomNumber(2)
// // //     if (id == '7') return generateRandomNumber(1)
// // //     if (id == '8') return generateRandomNumber(1)
// // //     if (id == '9') return generateRandomNumber(1)
// // //     if (id == '10') return generateRandomNumber(1)
// // //     if (id == '11') {
// // //       if (Math.random() > 0.6)
// // //         return (generateRandomNumber(4) + Math.random()).toFixed(2)
// // //       else if (Math.random() > 0.4)
// // //         return (generateRandomNumber(3) + Math.random()).toFixed(2)
// // //       else return (generateRandomNumber(2) + Math.random()).toFixed(2)
// // //     }

// // //     return generateRandomNumber(2)
// // //   }

// // //   function generateLevels(totalLevels) {
// // //     const levelsArray = []
// // //     let numOfProblems = getNumOfProblems(id)

// // //     for (let i = 1; i <= totalLevels; i++) {
// // //       const nums = Array(numOfProblems)
// // //         .fill(null)
// // //         .map(() => {
// // //           return Math.random() > 0.9
// // //             ? getRandomNumber() * -1
// // //             : getRandomNumber()
// // //         })

// // //       let sum = nums.reduce((acc, num) => acc + num, 0)

// // //       if (sum < 0) console.log(sum)

// // //       levelsArray.push({
// // //         level: i,
// // //         numbers: nums,
// // //         correctAns: sum,
// // //         userSolution: '',
// // //         isCorrect: null, // Use `null` to indicate unattempted levels
// // //       })
// // //     }

// // //     return levelsArray
// // //   }

// // //   function handleInputChange(levelIndex, value) {
// // //     setLevels((prevLevels) =>
// // //       prevLevels.map((level, index) =>
// // //         index === levelIndex ? { ...level, userSolution: value } : level
// // //       )
// // //     )
// // //   }

// // //   function checkSolution() {
// // //     setLevels((prevLevels) =>
// // //       prevLevels.map((level) => {
// // //         const isCorrect =
// // //           level.userSolution === '' // Empty answers
// // //             ? false
// // //             : parseInt(level.userSolution, 10) === level.correctAns
// // //         return { ...level, isCorrect }
// // //       })
// // //     )
// // //   }

// // //   useEffect(() => {
// // //     if (timesup) {
// // //       // Clear the timer when time's up
// // //       clearInterval(timerRef.current)
// // //       timerRef.current = null
// // //       // reset the timer
// // //       setTime(TIMER)
// // //       // submit the answers when time is up
// // //       checkSolution()
// // //     }
// // //   }, [timesup])

// // //   return (
// // //     <>
// // //       <h1 className="main-heading">
// // //         {id == '11'
// // //           ? 'Advanced Level (Addition)'
// // //           : `Level ${id} Mental Practice`}
// // //       </h1>
// // //       {/* Quiz Timer */}
// // //       <div className="quiz-timer">
// // //         {isTimerRunning && (
// // //           <h2>
// // //             Time Remaining: {Math.floor(time / 60)} minutes{' '}
// // //             {String(time % 60).padStart(2, '0')} seconds
// // //           </h2>
// // //         )}
// // //         <button
// // //           onClick={handleTimer}
// // //           style={{
// // //             padding: '10px 20px',
// // //             backgroundColor: '#4CAF50',
// // //             color: 'white',
// // //             border: 'none',
// // //             borderRadius: '5px',
// // //             cursor: 'pointer',
// // //             marginLeft: '10px',
// // //             marginTop: '20px',
// // //           }}
// // //         >
// // //           {isTimerRunning ? 'Stop & Reset Timer' : 'Start Timer'}
// // //         </button>
// // //       </div>
// // //       <div className="box-container">
// // //         {levels.map((level, index) => (
// // //           <div
// // //             className="box card"
// // //             style={{ height: 'fit-content' }}
// // //             key={level.level}
// // //           >
// // //             <div className="boxsm">
// // //               <p>#{level.level}</p>
// // //             </div>
// // //             <div>
// // //               {level.numbers.map((num, idx) => (
// // //                 <p
// // //                   style={{
// // //                     fontSize: id == '11' ? '0.8rem' : '1.2rem',
// // //                     textAlign: 'right',
// // //                     letterSpacing: id == '11' ? '1px' : '0px',
// // //                   }}
// // //                   key={idx}
// // //                 >
// // //                   {num}
// // //                 </p>
// // //               ))}
// // //             </div>
// // //             <div
// // //               className="boxsm answer-section"
// // //               style={{
// // //                 backgroundColor:
// // //                   level.isCorrect === null
// // //                     ? 'white' // Default white for unattempted levels
// // //                     : level.isCorrect
// // //                     ? 'lightgreen' // Green for correct answers
// // //                     : 'lightcoral', // Red for wrong or empty answers
// // //                 display: 'flex',
// // //                 justifyContent: 'center',
// // //                 alignItems: 'center',
// // //                 flexDirection: 'column',
// // //                 gap: '10px',
// // //               }}
// // //             >
// // //               <div
// // //                 style={{
// // //                   display: 'flex',
// // //                   justifyContent: 'center',
// // //                   alignItems: 'center',
// // //                   flexDirection: 'column',
// // //                 }}
// // //               >
// // //                 <input
// // //                   style={{
// // //                     width: '80px',
// // //                     fontWeight: 'bold',
// // //                     fontSize: '1.1rem',
// // //                     backgroundColor: 'transparent',
// // //                     borderRadius: '10px',
// // //                     padding: '5px',
// // //                   }}
// // //                   value={level.userSolution}
// // //                   onChange={(e) => handleInputChange(index, e.target.value)}
// // //                   type="number"
// // //                   placeholder="Answer"
// // //                   disabled={level.isCorrect || !isTimerRunning} // Disable input if already evaluated
// // //                 />
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //         <div>
// // //           <button
// // //             onClick={checkSolution}
// // //             style={{
// // //               padding: '10px 20px',
// // //               backgroundColor: '#4CAF50',
// // //               color: 'white',
// // //               border: 'none',
// // //               borderRadius: '5px',
// // //               cursor: 'pointer',
// // //               marginTop: '20px',
// // //             }}
// // //           >
// // //             Submit
// // //           </button>
// // //           <button
// // //             onClick={() => setLevels(generateLevels(15))}
// // //             style={{
// // //               padding: '10px 20px',
// // //               backgroundColor: '#f44336',
// // //               color: 'white',
// // //               border: 'none',
// // //               borderRadius: '5px',
// // //               cursor: 'pointer',
// // //               marginLeft: '10px',
// // //               marginTop: '20px',
// // //             }}
// // //           >
// // //             Clear All
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Render the modal */}
// // //       {modalMessage && (
// // //         <Modal
// // //           message={modalMessage}
// // //           onClose={() => setModalMessage('')} // Close the modal
// // //         />
// // //       )}
// // //     </>
// // //   )
// // // }
