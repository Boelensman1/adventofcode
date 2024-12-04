const words = ['XMAS', 'SAMX']

const main = (input: string) => {
  /* First split all possible ways the input can be read out into simple horizontal strings */
  const horLines = input.trim().split('\n')

  const inputSize = horLines.length // should be a square

  const verLines = []
  for (let x = 0; x < inputSize; x += 1) {
    let verLine = ''
    for (let y = 0; y < inputSize; y += 1) {
      verLine += horLines[y][x]
    }
    verLines.push(verLine)
  }

  const diagLines = []
  // Diagonals starting from different y positions
  for (let y = 0; y < inputSize; y += 1) {
    let diagLineRight = ''
    let diagLineLeft = ''
    for (let diag = 0; diag < inputSize - y; diag += 1) {
      diagLineRight += horLines[y + diag][diag]
      diagLineLeft += horLines[y + diag][inputSize - 1 - diag]
    }
    diagLines.push(diagLineRight, diagLineLeft)
  }

  // Diagonals starting from different x positions
  for (let x = 1; x < inputSize; x += 1) {
    let diagLineRight = ''
    let diagLineLeft = ''
    for (let diag = 0; diag < inputSize - x; diag += 1) {
      diagLineRight += horLines[diag][x + diag]
      diagLineLeft += horLines[diag][inputSize - 1 - x - diag]
    }
    diagLines.push(diagLineRight, diagLineLeft)
  }

  /* Now count the occurances in these strings */
  const allLines = [...horLines, ...verLines, ...diagLines]
  let total = 0

  for (const line of allLines) {
    for (const word of words) {
      let count = 0
      let pos = line.indexOf(word)
      while (pos !== -1) {
        count += 1
        pos = line.indexOf(word, pos + 1)
      }
      total += count
    }
  }

  return total
}

export default main
