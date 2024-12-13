const memo = new Map<string, number>()

interface Button {
  deltaX: number
  deltaY: number
}

interface Machine {
  id: number
  buttonA: Button
  buttonB: Button
}

interface DistanceToPrice {
  x: number
  y: number
}

const getButtonFromLine = (line: string): Button => {
  const match = /X([+-]\d*), Y([+-]\d*)/.exec(line)
  return {
    deltaX: Number.parseInt(match[1], 10),
    deltaY: Number.parseInt(match[2], 10),
  }
}

const getPriceFromLine = (line: string): DistanceToPrice => {
  const match = /X=(\d*), Y=(\d*)/.exec(line)
  return {
    x: Number.parseInt(match[1], 10),
    y: Number.parseInt(match[2], 10),
  }
}

const costA = 3
const costB = 1

const getMinimalTokensForPice = (
  machine: Machine,
  xDistance: number,
  yDistance: number,
  aPresses = 0,
  bPresses = 0,
): number => {
  const key = `${machine.id},${xDistance},${yDistance}`
  if (memo.has(key)) {
    return memo.get(key)!
  }

  if (xDistance === 0 && yDistance === 0) {
    return aPresses * costA + bPresses * costB
  }
  if (aPresses > 100 || bPresses > 100 || xDistance < 0 || yDistance < 0) {
    return Infinity
  }

  const tokensA = getMinimalTokensForPice(
    machine,
    xDistance - machine.buttonA.deltaX,
    yDistance - machine.buttonA.deltaY,
    aPresses + 1,
    bPresses,
  )
  const tokensB = getMinimalTokensForPice(
    machine,
    xDistance - machine.buttonB.deltaX,
    yDistance - machine.buttonB.deltaY,
    aPresses,
    bPresses + 1,
  )

  const result = Math.min(tokensA, tokensB)
  memo.set(key, result)
  return result
}

const main = (input: string) => {
  const lines = input.trim().split('\n')

  const machines: Machine[] = []
  const distanceToPrice: DistanceToPrice[] = []
  for (let i = 0; i < lines.length; i += 4) {
    machines.push({
      id: i,
      buttonA: getButtonFromLine(lines[i]),
      buttonB: getButtonFromLine(lines[i + 1]),
    })
    distanceToPrice.push(getPriceFromLine(lines[i + 2]))
  }

  return machines.reduce((acc, machine, i) => {
    const minimalTokensForPice = getMinimalTokensForPice(
      machine,
      distanceToPrice[i].x,
      distanceToPrice[i].y,
    )
    if (minimalTokensForPice === Infinity) {
      return acc
    }
    return acc + minimalTokensForPice
  }, 0)
}

export default main
