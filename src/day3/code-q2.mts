const main = (input: string) => {
  let total = 0

  const regex = /mul\((\d+),(\d+)\)|(?:don't|do)\(\)/g
  let match
  let mulIsEnabled = true
  while ((match = regex.exec(input)) !== null) {
    const [fullMatch] = match
    const [, num1, num2] = match.map((m) => Number.parseInt(m, 10))

    switch (fullMatch) {
      case 'do()': {
        mulIsEnabled = true
        continue
      }
      case "don't()": {
        mulIsEnabled = false
        continue
      }
      default:
        if (!mulIsEnabled) {
          continue
        }
        total += num1 * num2
    }
  }
  return total
}

export default main
