const memo = new Map<string, number>()

const designIsPossible = (
  desiredDesign: string,
  towelPatterns: string[],
): number => {
  const memoval = memo.get(desiredDesign)
  if (memoval !== undefined) {
    return memoval
  }

  if (desiredDesign === '') {
    return 1
  }

  const fittingPatterns = towelPatterns.filter((pattern) =>
    desiredDesign.startsWith(pattern),
  )

  if (fittingPatterns.length === 0) {
    return 0
  }

  return fittingPatterns.reduce((acc, pattern) => {
    const remaining = desiredDesign.substring(pattern.length)
    const result = designIsPossible(remaining, towelPatterns)

    memo.set(remaining, result)
    return acc + result
  }, 0)
}

const main = (input: string) => {
  const lines = input.trim().split('\n')

  const towelPatterns = lines
    .shift()!
    .split(',')
    .map((p) => p.trim())

  // remove empty line
  lines.shift()
  const desiredDesigns = lines

  return desiredDesigns.reduce((acc, desiredDesign, i) => {
    console.log(`Starting`, i + 1)
    return acc + designIsPossible(desiredDesign, towelPatterns)
  }, 0)
}

export default main
