interface CalibrationEquation {
  testValue: number
  numbers: number[]
}

enum Operation {
  SUM,
  TIMES,
}

const calculate = (equation: CalibrationEquation, operations: Operation[]) =>
  equation.numbers.reduce((acc, number, i) => {
    if (i === 0) {
      return number
    }

    const operation = operations[i - 1]
    switch (operation) {
      case Operation.TIMES:
        return acc * number
      default:
      case Operation.SUM:
        return acc + number
    }
  }, 0)

const canBeCombined = (
  equation: CalibrationEquation,
  operations: Operation[],
): boolean => {
  if (operations.length === equation.numbers.length) {
    return calculate(equation, operations) === equation.testValue
  }

  return (
    canBeCombined(equation, [...operations, Operation.SUM]) ||
    canBeCombined(equation, [...operations, Operation.TIMES])
  )
}

const main = (input: string) => {
  const equations: CalibrationEquation[] = input
    .trim()
    .split('\n')
    .map((line) => {
      const [testValue, rest] = line.split(':')
      const numbers = rest
        .trim()
        .split(' ')
        .map((n) => Number.parseInt(n, 10))
      return { testValue: Number.parseInt(testValue), numbers }
    })

  return equations
    .filter((eq) => canBeCombined(eq, []))
    .reduce((totalResult, eq) => totalResult + eq.testValue, 0)
}

export default main
