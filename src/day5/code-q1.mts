const toInt = (inp: string) => Number.parseInt(inp, 10)

const main = (input: string) => {
  const lines = input.trim().split('\n')
  const startOfUpdates = lines.indexOf('')

  const rules = lines
    .slice(0, startOfUpdates)
    .map((r) => r.split('|').map(toInt))
  const updates = lines
    .slice(startOfUpdates + 1)
    .map((u) => u.split(',').map(toInt))

  return updates
    .filter((update) => {
      for (const rule of rules) {
        const firstIndex = update.indexOf(rule[0])
        const secondIndex = update.indexOf(rule[1])
        if (
          firstIndex !== -1 &&
          secondIndex !== -1 &&
          firstIndex > secondIndex
        ) {
          return false
        }
      }
      return true
    })
    .reduce((acc, update) => acc + update[Math.floor(update.length / 2)], 0)
}

export default main
