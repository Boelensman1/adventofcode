const getAllPairwiseCombinations = <T>(arr: T[]): [T, T][] => {
  const combinations = []
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      combinations.push([arr[i], arr[j]] as [T, T])
    }
  }
  return combinations
}

export default getAllPairwiseCombinations
