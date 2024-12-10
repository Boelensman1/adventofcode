const main = (input: string) => {
  let total = 0
  let mulIsEnabled = true

  const regex = /mul\((\d+),(\d+)\)|(?:don't|do)\(\)/g
  let match
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
      default: // a mul(x,y) operation
        if (!mulIsEnabled) {
          continue
        }
        total += num1 * num2
    }
  }
  return total
}

export default main
