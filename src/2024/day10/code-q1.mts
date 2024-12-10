import edmondsKarp from '../../utils/edmondsKarp.mjs'

type Node = [number, number][]

const main = (input: string) => {
  const inputArr = input
    .trim()
    .split('\n')
    .map((line) => line.split('').map((n) => parseInt(n, 10)))

  const inputHeight = inputArr.length
  const inputWidth = inputArr[0].length

  const getNodeId = (x: number, y: number) => y * inputWidth + x + 1 // +1 because of source and sink nodes

  const sinkNodeId = 0

  const adjencyList: Node[] = [[]]
  const sourceNodeIds = []

  for (let y = 0; y < inputHeight; y += 1) {
    const lineAbove = inputArr[y - 1] ?? []
    const lineBelow = inputArr[y + 1] ?? []
    const line = inputArr[y]

    for (let x = 0; x < inputWidth; x += 1) {
      const height = line[x]
      const possibleConnections = [
        [x - 1, y, line[x - 1] ?? -10], // left
        [x + 1, y, line[x + 1] ?? -10], // right
        [x, y - 1, lineAbove[x] ?? -10], // up
        [x, y + 1, lineBelow[x] ?? -10], // down
      ]

      const node: Node = possibleConnections
        .filter(
          ([, , posConnHeight]) => height === posConnHeight - 1, // check if gently increasing
        )
        .map(([xC, yC]) => [getNodeId(xC, yC), Infinity /* capacity max */])

      if (height === 9) {
        // add connection to sink node
        node.push([sinkNodeId, 1])
      }
      if (height == 0) {
        sourceNodeIds.push(getNodeId(x, y))
      }

      adjencyList.push(node)
    }
  }

  return sourceNodeIds.reduce(
    (acc, sourceNodeId) =>
      acc + edmondsKarp(adjencyList, sourceNodeId, sinkNodeId),
    0,
  )
}

export default main
