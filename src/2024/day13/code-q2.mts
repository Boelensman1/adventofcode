interface Button {
  deltaX: number
  deltaY: number
}

interface Machine {
  id: number
  buttonA: Button
  buttonB: Button
  price: DistanceToPrice
}

interface DistanceToPrice {
  x: number
  y: number
}

const getButtonFromLine = (line: string): Button => {
  const match = /X([+-]\d*), Y([+-]\d*)/.exec(line)
  return {
    deltaX: Number.parseInt(match![1], 10),
    deltaY: Number.parseInt(match![2], 10),
  }
}

const getPriceFromLine = (line: string): DistanceToPrice => {
  const match = /X=(\d*), Y=(\d*)/.exec(line)
  return {
    x: Number.parseInt(match![1], 10) + 10000000000000,
    y: Number.parseInt(match![2], 10) + 10000000000000,
  }
}

const costA = 3
const costB = 1

const getMinimalTokensForPice = (machine: Machine) => {
  // {{pressA -> -((bDy priceX - bDx priceY)/(aDy bDx - aDx bDy)),
  // pressB -> -((-aDy priceX + aDx priceY)/(aDy bDx - aDx bDy))}}
  // ^ Found using mathematica

  const pressA1 =
    machine.buttonB.deltaY * machine.price.x -
    machine.buttonB.deltaX * machine.price.y
  const pressA2 =
    machine.buttonA.deltaY * machine.buttonB.deltaX -
    machine.buttonA.deltaX * machine.buttonB.deltaY
  const pressA = -pressA1 / pressA2

  const pressB1 =
    -machine.buttonA.deltaY * machine.price.x +
    machine.buttonA.deltaX * machine.price.y
  const pressB2 =
    machine.buttonA.deltaY * machine.buttonB.deltaX -
    machine.buttonA.deltaX * machine.buttonB.deltaY
  const pressB = -pressB1 / pressB2

  if (Math.round(pressA) === pressA && Math.round(pressB) === pressB) {
    return pressA * costA + pressB * costB
  }
  return Infinity
}

const main = (input: string) => {
  const lines = input.trim().split('\n')

  const machines: Machine[] = []
  for (let i = 0; i < lines.length; i += 4) {
    machines.push({
      id: i,
      buttonA: getButtonFromLine(lines[i]),
      buttonB: getButtonFromLine(lines[i + 1]),
      price: getPriceFromLine(lines[i + 2]),
    })
  }

  return machines.reduce((acc, machine) => {
    const minimalTokensForPice = getMinimalTokensForPice(machine)
    if (minimalTokensForPice === Infinity) {
      return acc
    }
    return acc + minimalTokensForPice
  }, 0)
}

export default main
