const memo = new Map<string, boolean>()

const designIsPossible = (
  desiredDesign: string,
  towelPatterns: string[],
): boolean => {
  const memoval = memo.get(desiredDesign)
  if (memoval !== undefined) {
    return memoval
  }

  if (desiredDesign === '') {
    return true
  }

  const fittingPatterns = towelPatterns.filter((pattern) =>
    desiredDesign.startsWith(pattern),
  )

  return fittingPatterns.some((pattern) => {
    const remaining = desiredDesign.substring(pattern.length)
    const result = designIsPossible(remaining, towelPatterns)
    memo.set(remaining, result)

    return result
  })
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

  return desiredDesigns.reduce(
    (acc, desiredDesign) =>
      designIsPossible(desiredDesign, towelPatterns) ? acc + 1 : acc,
    0,
  )
}

export default main
