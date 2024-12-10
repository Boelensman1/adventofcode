interface SpaceOnDisk {
  id: number
  startIndex: number
  size: number
}

const gaussSum = (n: number) => (n * (n + 1)) / 2
const fileChecksum = (file: SpaceOnDisk) =>
  (gaussSum(file.startIndex + file.size - 1) - gaussSum(file.startIndex - 1)) *
  file.id

const main = (input: string) => {
  const freeSpaces: SpaceOnDisk[] = []
  const unMovedFiles: SpaceOnDisk[] = []

  let sizeSoFar = 0
  // parse input
  input
    .trim()
    .split('')
    .forEach((char, index) => {
      const size = parseInt(char)
      const id = index / 2
      if (index % 2 === 0) {
        unMovedFiles.push({
          id,
          startIndex: sizeSoFar,
          size,
        })
      } else {
        freeSpaces.push({
          id,
          startIndex: sizeSoFar,
          size,
        })
      }
      sizeSoFar += size
    })

  let checksum = 0
  unMovedFiles.shift()! // skip the first file as it doesn't change the checksum

  // start moving files
  while (unMovedFiles.length > 0) {
    const file = unMovedFiles.pop()!
    const freeSpaceIndex = freeSpaces.findIndex(
      (fsp) => fsp.size >= file.size && fsp.id < file.id,
    )
    if (freeSpaceIndex !== -1) {
      const freeSpace = freeSpaces[freeSpaceIndex]
      file.startIndex = freeSpace.startIndex
      freeSpace.size -= file.size
      freeSpace.startIndex += file.size
      if (freeSpace.size === 0) {
        // no more free space in freeSpace, remove it
        freeSpaces.splice(freeSpaceIndex, 1)
      }
    }

    checksum += fileChecksum(file)
  }

  return checksum
}

export default main
