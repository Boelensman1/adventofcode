const getSimpleReportSafety = (levels: number[]) => {
  // only one level, trivially conforms to the requirements
  if (levels.length <= 1) {
    return true
  }

  const increasing = levels[0] > levels[1]
  for (let i = 1; i < levels.length; i += 1) {
    const prevLevel = levels[i - 1]
    const level = levels[i]

    // The levels are either all increasing or all decreasing.
    if (
      (increasing && level > prevLevel) ||
      (!increasing && level < prevLevel)
    ) {
      return false
    }

    // Any two adjacent levels differ by at least one
    if (level === prevLevel) {
      return false
    }
    // ... and at most three.
    if (Math.abs(level - prevLevel) > 3) {
      return false
    }
  }
  return true
}

const main = (input: string) => {
  return input
    .trim()
    .split('\n')
    .map((report) => {
      const levels = report.split(' ').map((l) => Number.parseInt(l, 10))
      const isSafe = getSimpleReportSafety(levels)

      // apply reactor (slow, dumb way to do this)
      if (!isSafe) {
        return levels
          .map((_level, i) => {
            const newReport = [...levels]
            newReport.splice(i, 1)
            return getSimpleReportSafety(newReport)
          })
          .some((safe) => safe)
      }

      return isSafe
    })
    .reduce((safeLevels, isSafe) => safeLevels + (isSafe ? 1 : 0), 0)
}

export default main
