const main = (input: string) => {
  const leftList: number[] = []
  const rightList: number[] = []
  for (const line of input.trim().split('\n')) {
    const [number1, number2] = line.split('   ').map((num) => parseInt(num, 10))
    leftList.push(number1)
    rightList.push(number2)
  }

  leftList.sort((a, b) => a - b)
  rightList.sort((a, b) => a - b)

  return leftList.reduce((acc, num1, i) => {
    const num2 = rightList[i]
    return acc + Math.abs(num1 - num2)
  }, 0)
}

export default main
