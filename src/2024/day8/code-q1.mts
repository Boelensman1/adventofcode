import getAllPairwiseCombinations from '../../utils/getAllPairwiseCombinations.js'

interface Antenna {
  x: number
  y: number
}

const main = (input: string) => {
  const lines = input.trim().split('\n')

  const maxY = lines.length
  const maxX = lines[0].length

  const antennasPerTypeMap = new Map<string, Antenna[]>()

  lines.map((line, y) => {
    line.split('').forEach((char, x) => {
      if (char !== '.') {
        let antennaPerType = antennasPerTypeMap.get(char)
        if (!antennaPerType) {
          antennaPerType = []
          antennasPerTypeMap.set(char, antennaPerType)
        }
        antennaPerType.push({ x, y })
      }
    })
  })

  const antiNodes = new Set<string>()

  antennasPerTypeMap.forEach((antennasPerType) => {
    if (antennasPerType.length === 1) {
      // only one antenna, can't have an antinode
      return
    }
    getAllPairwiseCombinations(antennasPerType).map(([ant1, ant2]) => {
      const slope = (ant1.y - ant2.y) / (ant1.x - ant2.x)
      const formula = (x: number) => x * slope - slope * ant1.x + ant1.y
      const Xantinode1 = Math.round(2 * ant1.x - ant2.x)
      const Yantinode1 = Math.round(formula(Xantinode1))

      const Xantinode2 = Math.round(2 * ant2.x - ant1.x)
      const Yantinode2 = Math.round(formula(Xantinode2))

      if (
        Xantinode1 >= 0 &&
        Xantinode1 < maxX &&
        Yantinode1 >= 0 &&
        Yantinode1 < maxY
      ) {
        antiNodes.add([Xantinode1, Yantinode1].toString())
      }

      if (
        Xantinode2 >= 0 &&
        Xantinode2 < maxX &&
        Yantinode2 >= 0 &&
        Yantinode2 < maxY
      ) {
        antiNodes.add([Xantinode2, Yantinode2].toString())
      }
    })
  })

  return antiNodes.size
}

export default main
