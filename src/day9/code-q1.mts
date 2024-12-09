import toInt from '../utils/toInt.js'

interface SpaceOnDisk {
  startIndex: number
  size: number
}

interface FileOnDisk extends SpaceOnDisk {
  id: number
}

const gaussSum = (n: number) => (n * (n + 1)) / 2

const main = (input: string) => {
  const freeSpaces: SpaceOnDisk[] = []
  const unMovedFiles: FileOnDisk[] = []

  let sizeSoFar = 0
  // parse input
  input
    .trim()
    .split('')
    .forEach((char, index) => {
      const size = toInt(char)
      if (index % 2 === 0) {
        const id = index / 2
        unMovedFiles.push({
          id,
          startIndex: sizeSoFar,
          size,
        })
      } else {
        freeSpaces.push({
          startIndex: sizeSoFar,
          size,
        })
      }
      sizeSoFar += size
    })

  freeSpaces.reverse()

  let checksum = 0
  unMovedFiles.shift()! // skip the first file as it doesn't change the checksum

  // start moving files
  while (unMovedFiles.length > 0) {
    const file = unMovedFiles.pop()!
    const freeSpace = freeSpaces.pop()!

    const usedSize = Math.min(file.size, freeSpace.size)
    checksum +=
      (gaussSum(freeSpace.startIndex + usedSize - 1) -
        gaussSum(freeSpace.startIndex - 1)) *
      file.id

    // we're changing file.size later, so calculate this first
    const noSpaceLeftAfter = file.size >= freeSpace.size

    if (file.size > freeSpace.size) {
      // we need more free space
      file.size -= usedSize
      unMovedFiles.push(file)
    } else if (file.size < freeSpace.size) {
      // we have some space left over
      freeSpace.size -= usedSize
      freeSpace.startIndex += usedSize
      freeSpaces.push(freeSpace)
    }

    // if no free space is left after the moving of this file, insert the next file
    if (noSpaceLeftAfter) {
      const fileWontMove = unMovedFiles.shift()!
      checksum +=
        (gaussSum(fileWontMove.startIndex + fileWontMove.size - 1) -
          gaussSum(fileWontMove.startIndex - 1)) *
        fileWontMove.id
    }
  }

  return checksum
}

export default main
