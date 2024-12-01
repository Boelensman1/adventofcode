import { readFileSync } from 'node:fs'

interface DayModule {
  default: (input: string) => Promise<number>
}

const PUZZLE = process.env.PUZZLE

if (!PUZZLE) {
  throw new Error('Puzzle env is required, input it like PUZZLE=1-1')
}

const [dayNumber, questionNumber] = PUZZLE.split('-').map((p) =>
  Number.parseInt(p, 10),
)

if (!dayNumber || !questionNumber) {
  throw new Error('Puzzle env is malformed, input it like PUZZLE=1-1')
}

const main = async () => {
  let func: (input: string) => Promise<number>
  try {
    const dayModule = (await import(
      `./day${dayNumber}/code-q${questionNumber}.mjs`
    )) as DayModule
    func = dayModule.default
  } catch (error) {
    throw new Error(
      `Function for day ${PUZZLE} not found: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  const input = readFileSync(`src/day${dayNumber}/input.txt`, 'utf-8')
  console.log(await func(input))
}

void main()
