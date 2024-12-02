import assert from 'node:assert'
import { readFileSync } from 'node:fs'
import q2slow from './code-q2.mjs'

const inputFile = './src/day1/input.txt'

const fast = (file: string) => {
  // still do readFileSync, streaming is not faster,
  // gives too much overhead with such a small input
  const input = readFileSync(file, 'utf-8')
  // map instead of object
  const occurancesInRightList = new Map<number, number>()

  const inputSplit = input.trim().split('\n')

  // Use Uint32Array instead of regular array
  const leftList = new Uint32Array(inputSplit.length)

  for (let i = 0; i < inputSplit.length; i++) {
    const line = inputSplit[i]
    const number1 = +line.slice(0, 5)
    const number2 = +line.slice(8, 13)
    leftList[i] = number1

    const old = occurancesInRightList.get(number2) ?? 0
    occurancesInRightList.set(number2, old + 1)
  }

  return leftList.reduce((acc, num1) => {
    const occuranceInRightList = occurancesInRightList.get(num1) ?? 0
    return acc + num1 * occuranceInRightList
  }, 0)
}

const slow = () => {
  const input = readFileSync(inputFile, 'utf-8')
  return q2slow(input)
}

const benchmark = () => {
  const iterations = 1000

  // Verify results are still equal + run each function once to warm up
  assert(slow() === fast(inputFile))

  const slowTimes: number[] = []
  const fastTimes: number[] = []

  // Alternate between slow and fast runs
  for (let i = 0; i < iterations; i++) {
    if (i % 2 === 0) {
      const startSlow = performance.now()
      slow()
      const endSlow = performance.now()
      slowTimes.push(endSlow - startSlow)
    } else {
      const startFast = performance.now()
      fast(inputFile)
      const endFast = performance.now()
      fastTimes.push(endFast - startFast)
    }
  }

  // Calculate averages
  const avgSlow = slowTimes.reduce((a, b) => a + b, 0) / (iterations / 2)
  const avgFast = fastTimes.reduce((a, b) => a + b, 0) / (iterations / 2)

  console.log(
    `Slow version average (${iterations / 2} runs): ${avgSlow.toFixed(2)}ms`,
  )
  console.log(
    `Fast version average (${iterations / 2} runs): ${avgFast.toFixed(2)}ms`,
  )
  console.log(`Speed improvement: ${(avgSlow / avgFast).toFixed(2)}x`)
}

benchmark()
