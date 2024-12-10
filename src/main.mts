import { readFileSync } from 'node:fs'

interface DayModule {
  default: (input: string) => Promise<number>
}

const PUZZLE = process.env.PUZZLE

if (!PUZZLE) {
  throw new Error('Puzzle env is required, input it like PUZZLE=1-1')
}

const [dayNumber, questionNumber] = PUZZLE.split('-').map((p) => parseInt(p))

if (!dayNumber || !questionNumber) {
  throw new Error('Puzzle env is malformed, input it like PUZZLE=1-1')
}

const getCurrentAOCYear = () => {
  const now = new Date()
  return now.getMonth() === 11 ? now.getFullYear() : now.getFullYear() - 1
}

const YEAR = process.env.YEAR
  ? parseInt(process.env.YEAR, 10)
  : getCurrentAOCYear()

if (!YEAR) {
  throw new Error('Year env is malformed, input it like YEAR=2024')
}

const FAST = process.env.FAST === '1'
const fastStr = FAST ? '-fast' : ''

const INPUTNR = process.env.INPUTNR ?? '0'
const inputNumber = parseInt(INPUTNR, 10)
const inputNrStr = inputNumber ? String(inputNumber) : ''

const main = async () => {
  const startTime = performance.now()

  let func: (input: string) => Promise<number>
  try {
    const dayModule = (await import(
      `./${YEAR}/day${dayNumber}/code-q${questionNumber}${fastStr}.mjs`
    )) as DayModule
    func = dayModule.default
  } catch (error) {
    throw new Error(
      `Function for day ${PUZZLE} and year ${YEAR} ${FAST ? '(FAST)' : ''} not found: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  let input: string
  try {
    input = readFileSync(
      `src/${YEAR}/day${dayNumber}/input${inputNrStr}.txt`,
      'utf-8',
    )
  } catch (error) {
    throw new Error(
      `Input for day ${PUZZLE} and year ${YEAR} ${inputNumber ? `(number ${inputNumber})` : ''} not found: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
  const result = await func(input)

  const endTime = performance.now()
  const executionTime = endTime - startTime

  console.log(`Result: ${result}`)
  console.log(`Execution time: ${executionTime.toFixed(2)}ms`)
}

void main()
