const blinkAtStone = (stone: number) => {
  if (stone === 0) {
    return 1
  }

  const stoneStr = String(stone)
  if (stoneStr.length % 2 === 0) {
    const leftStone = stoneStr.substring(0, stoneStr.length / 2)
    const rightStone = stoneStr.substring(stoneStr.length / 2)
    return [Number(leftStone), Number(rightStone)]
  }

  return stone * 2024
}

const main = (input: string, times = 25) => {
  let stones = input
    .trim()
    .split(' ')
    .map((n) => parseInt(n, 10))

  for (let i = 0; i < times; i += 1) {
    stones = stones.flatMap(blinkAtStone)
  }

  return stones.length
}

export default main
