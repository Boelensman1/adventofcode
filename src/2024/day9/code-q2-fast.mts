interface SpaceOnDisk {
  startIndex: number
  size: number
}

interface FileOnDisk extends SpaceOnDisk {
  id: number
}

const gaussSum = (n: number) => (n * (n + 1)) / 2
const fileChecksum = (file: FileOnDisk) =>
  (gaussSum(file.startIndex + file.size - 1) - gaussSum(file.startIndex - 1)) *
  file.id

const findIndexFrom = <T,>(
  arr: T[],
  cb: (arg0: T) => boolean,
  fromIndex: number,
  toIndex = Infinity,
): number => {
  const maxIndex = Math.min(arr.length - 1, toIndex)
  for (let i = fromIndex; i <= maxIndex; i += 1) {
    if (cb(arr[i])) {
      return i
    }
  }
  return -1
}

// Runtime O(10*n) = O(N)
const main = (input: string) => {
  const freeSpaces: SpaceOnDisk[] = []
  const unMovedFiles: FileOnDisk[] = []

  let sizeSoFar = 0
  // parse input
  input
    .trim()
    .split('')
    .forEach((char, index) => {
      const size = parseInt(char)
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

  let checksum = 0
  unMovedFiles.shift()! // skip the first file as it doesn't change the checksum

  const memo = Array<number>(10).fill(0)

  // start moving files
  while (unMovedFiles.length > 0) {
    const file = unMovedFiles.pop()!
    const freeSpaceIndex =
      memo[file.size] === -1
        ? -1
        : findIndexFrom(
            freeSpaces,
            (fsp) => fsp.size >= file.size,
            memo[file.size],
            file.id - 1,
          )
    if (freeSpaceIndex !== -1) {
      const freeSpace = freeSpaces[freeSpaceIndex]
      file.startIndex = freeSpace.startIndex
      freeSpace.size -= file.size
      freeSpace.startIndex += file.size
    }

    memo[file.size] = freeSpaceIndex
    checksum += fileChecksum(file)
  }

  return checksum
}

export default main
