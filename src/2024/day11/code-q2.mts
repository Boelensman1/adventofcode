// dynamic programming!!!
const memo: Map<number, number>[] = []

const blinkAtStone = (stone: number, times: number): number => {
  if (times === 0) {
    return 1
  }

  if (stone === 0) {
    return blinkAtStone(1, times - 1)
  }

  const stoneStr = String(stone)
  if (stoneStr.length % 2 === 0) {
    const leftStone = Number(stoneStr.substring(0, stoneStr.length / 2))
    const rightStone = Number(stoneStr.substring(stoneStr.length / 2))

    let leftResult = memo[times - 1].get(leftStone)
    if (!leftResult) {
      leftResult = blinkAtStone(leftStone, times - 1)
      memo[times - 1].set(leftStone, leftResult)
    }

    let rightResult = memo[times - 1].get(rightStone)
    if (!rightResult) {
      rightResult = blinkAtStone(rightStone, times - 1)
      memo[times - 1].set(rightStone, rightResult)
    }

    const totalResult = leftResult + rightResult

    return totalResult
  }

  return blinkAtStone(stone * 2024, times - 1)
}

const main = (input: string, times = 75) => {
  const stones = input
    .trim()
    .split(' ')
    .map((n) => parseInt(n, 10))

  // initialise memo
  for (let i = 0; i < times; i += 1) {
    memo[i] = new Map()
  }

  return stones.reduce((acc, stone) => acc + blinkAtStone(stone, times), 0)
}

export default main
