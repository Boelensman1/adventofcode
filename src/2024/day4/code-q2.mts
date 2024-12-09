const main = (input: string) => {
  const horLines = input.trim().split('\n')
  const inputXSize = horLines[0].length
  const inputYSize = horLines.length

  let count = 0
  // split up the input into blocks of 3x3 and see if they are an X-MAS
  for (let x = 0; x < inputXSize - 2; x += 1) {
    for (let y = 0; y < inputYSize - 2; y += 1) {
      if (horLines[y + 1][x + 1] === 'A') {
        // center is OK

        if (horLines[y][x] === 'M') {
          if (
            horLines[y][x + 2] === 'S' &&
            horLines[y + 2][x] === 'M' &&
            horLines[y + 2][x + 2] === 'S'
          ) {
            /* M.S
               .A.
               M.S */
            count += 1
          }
          if (
            horLines[y][x + 2] === 'M' &&
            horLines[y + 2][x] === 'S' &&
            horLines[y + 2][x + 2] === 'S'
          ) {
            /* M.M
               .A.
               S.S */
            count += 1
          }
        }

        if (horLines[y][x] === 'S') {
          if (
            horLines[y][x + 2] === 'M' &&
            horLines[y + 2][x] === 'S' &&
            horLines[y + 2][x + 2] === 'M'
          ) {
            /* S.M
               .A.
               S.M */
            count += 1
          }
          if (
            horLines[y][x + 2] === 'S' &&
            horLines[y + 2][x] === 'M' &&
            horLines[y + 2][x + 2] === 'M'
          ) {
            /* S.S
               .A.
               M.M */
            count += 1
          }
        }
      }
    }
  }

  return count
}

export default main
