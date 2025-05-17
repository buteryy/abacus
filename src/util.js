export function generateRandomNumber(n) {
  if (n <= 0) {
    throw new Error("Number of digits must be a positive integer.");
  }

  const min = Math.pow(10, n - 1);
  const max = Math.pow(10, n) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export const TIMER = 60 * 5