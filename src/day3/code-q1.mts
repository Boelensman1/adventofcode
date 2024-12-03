const main = (input: string) => {
  let total = 0

  const regex = /mul\((\d+),(\d+)\)/g
  let match
  while ((match = regex.exec(input)) !== null) {
    const [, num1, num2] = match.map((m) => Number.parseInt(m, 10))
    total += num1 * num2
  }
  return total
}

export default main
