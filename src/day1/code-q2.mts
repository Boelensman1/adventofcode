const main = (input: string) => {
  const leftList: number[] = []
  const occurancesInRightList: Record<number, number> = {}

  for (const line of input.trim().split('\n')) {
    const [number1, number2] = line.split('   ').map((num) => parseInt(num, 10))
    leftList.push(number1)

    if (!occurancesInRightList[number2]) {
      occurancesInRightList[number2] = 1
    } else {
      occurancesInRightList[number2] += 1
    }
  }

  return leftList.reduce((acc, num1) => {
    const occuranceInRightList = occurancesInRightList[num1] ?? 0
    return acc + num1 * occuranceInRightList
  }, 0)
}

export default main
