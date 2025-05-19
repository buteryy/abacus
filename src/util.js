export function generateRandomNumber(n) {
  if (n <= 0) {
    throw new Error('Number of digits must be a positive integer.')
  }

  const min = Math.pow(10, n - 1)
  const max = Math.pow(10, n) - 1

  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const TIMER = 60 * 5

export function getNumOfProblems(id) {
  if (id == '1') return 7
  if (id == '2') return 6
  if (id == '3') return 5
  if (id == '4') return 6
  if (id == '5') return 5
  if (id == '6') return 4
  if (id == '7') return 6
  if (id == '8') return 5
  if (id == '9') return 4
  if (id == '10') return 3
  if (id == '11') return 10
}
