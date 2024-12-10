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

export default findIndexFrom
