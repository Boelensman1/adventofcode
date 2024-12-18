import { PriorityQueue } from '@datastructures-js/priority-queue'
type Grid = (Wall | null)[][]

type Coordinate = [number, number]

class Wall {
  constructor(
    public x: number,
    public y: number,
    public nr: number,
  ) {}

  get coordString() {
    return `${this.x},${this.y}`
  }
}

const hUnbound = (maxX: number, maxY: number, pos: Coordinate) => {
  const [x, y] = pos
  return maxX - x + maxY - y
}

const getNeighborsUnbound = (
  maxX: number,
  maxY: number,
  grid: Grid,
  maxBytes: number,
  pos: Coordinate,
): Coordinate[] => {
  const [x, y] = pos

  const posNeighbors: Coordinate[] = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]

  return posNeighbors.filter(([xNew, yNew]) => {
    if (xNew < 0 || xNew > maxX || yNew < 0 || yNew > maxY) {
      // can't move outside the grid
      return false
    }

    const wall = grid[yNew][xNew]
    if (wall && wall.nr <= maxBytes) {
      // can't move into a wall
      return false
    }
    return true
  })
}

const coordToNum = (coord: Coordinate) => coord[0] * 1000 + coord[1]

// A*, from wikipedia
const calculateCanReachEnd = (
  grid: Grid,
  maxX: number,
  maxY: number,
  maxBytes: number,
) => {
  const h: (pos: Coordinate) => number = hUnbound.bind(undefined, maxX, maxY)
  const getNeighbors: (pos: Coordinate) => Coordinate[] =
    getNeighborsUnbound.bind(undefined, maxX, maxY, grid, maxBytes)
  const start: Coordinate = [0, 0]
  const goal: Coordinate = [maxX, maxY]

  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.
  const openQueue = new PriorityQueue<Coordinate>((a, b) => h(a) - h(b))
  openQueue.push(start)
  const openSet = new Set<number>([coordToNum(start)])

  // For node n, gScore[n] is the currently known cost of the cheapest path from start to n.
  const gScore = new Map<number, number>() // map with default value of Infinity
  const fScore = new Map<number, number>() // map with default value of Infinity
  for (let y = 0; y <= maxY; y += 1) {
    for (let x = 0; x <= maxX; x += 1) {
      gScore.set(coordToNum([x, y]), Infinity)
      fScore.set(coordToNum([x, y]), Infinity)
    }
  }
  gScore.set(coordToNum(start), 0)

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  fScore.set(coordToNum(start), h(start))

  while (!openQueue.isEmpty()) {
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
    const current = openQueue.pop() //the node in openSet having the lowest fScore[] value
    const currentN = coordToNum(current)

    if (current[0] === goal[0] && current[1] === goal[1]) {
      return true
      //return reconstruct_path(cameFrom, current)
    }

    openSet.delete(currentN)
    const neighbors = getNeighbors(current)
    for (const neighbor of neighbors) {
      const neighborN = coordToNum(neighbor)

      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      const tentative_gScore = gScore.get(currentN)! + 1

      if (tentative_gScore < gScore.get(neighborN)!) {
        // This path to neighbor is better than any previous one. Record it!
        gScore.set(neighborN, tentative_gScore)
        fScore.set(neighborN, tentative_gScore + h(neighbor))
        if (!openSet.has(neighborN)) {
          openSet.add(neighborN)
          openQueue.push(neighbor)
        }
      }
    }
  }

  // Open set is empty but goal was never reached
  return false
}

const main = (input: string) => {
  const objects: Wall[] = []

  input
    .trim()
    .split('\n')
    .forEach((line) => {
      const [x, y] = line.split(',').map((c) => parseInt(c, 10))
      objects.push(new Wall(x, y, objects.length))
    })

  const maxX = objects.reduce((acc, obj) => (acc < obj.x ? obj.x : acc), 0)
  const maxY = objects.reduce((acc, obj) => (acc < obj.y ? obj.y : acc), 0)

  const grid: Grid = new Array(maxY + 1)
    .fill([])
    .map(() => new Array<Wall | null>(maxX + 1).fill(null))
  objects.forEach((obj) => {
    grid[obj.y][obj.x] = obj
  })

  // Binary search
  let left = 0
  let right = objects.length - 1
  let result = 'always possible'

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const canReachEnd = calculateCanReachEnd(grid, maxX, maxY, mid)

    if (!canReachEnd) {
      // Path is blocked, try lower number of walls
      result = objects[mid].coordString
      right = mid - 1
    } else {
      // Path is possible, try higher number of walls
      left = mid + 1
    }
  }

  return result
}

export default main
