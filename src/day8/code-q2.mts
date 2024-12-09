import getAllPairwiseCombinations from '../utils/getAllPairwiseCombinations.js'

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

      for (let x = 0; x < maxX; x += 1) {
        const y = Math.round(formula(x) * 1000) / 1000
        if (Math.round(y) === y && y >= 0 && y < maxY) {
          antiNodes.add([x, y].toString())
        }
      }
    })
  })

  return antiNodes.size
}

export default main
