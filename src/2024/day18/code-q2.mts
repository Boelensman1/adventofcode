import { PriorityQueue } from '@datastructures-js/priority-queue'
type Grid = (Wall | null)[][]

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

const hUnbound = (maxX: number, maxY: number, pos: string) => {
  const [x, y] = pos.split(',').map((c) => parseInt(c, 10))
  return maxX - x + maxY - y
}

const getNeighborsUnbound = (
  maxX: number,
  maxY: number,
  grid: Grid,
  maxBytes: number,
  pos: string,
) => {
  const [x, y] = pos.split(',').map((c) => parseInt(c, 10))

  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]
    .filter(([xNew, yNew]) => {
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
    .map((s) => s.join(','))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const d = (_current: string, _neighbor: string) => 1

// A*, from wikipedia
const calculateResult = (
  grid: Grid,
  maxX: number,
  maxY: number,
  maxBytes: number,
) => {
  const h = hUnbound.bind(undefined, maxX, maxY)
  const getNeighbors = getNeighborsUnbound.bind(
    undefined,
    maxX,
    maxY,
    grid,
    maxBytes,
  )
  const start = '0,0'
  const goal = `${maxX},${maxY}`

  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.
  const openSet = new PriorityQueue<string>((a, b) => h(a) - h(b))
  openSet.push(start)

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
  // to n currently known.
  const cameFrom = new Map()

  // For node n, gScore[n] is the currently known cost of the cheapest path from start to n.
  const gScore = new Map<string, number>() // map with default value of Infinity
  const fScore = new Map<string, number>() // map with default value of Infinity
  for (let y = 0; y <= maxY; y += 1) {
    for (let x = 0; x <= maxX; x += 1) {
      gScore.set(`${x},${y}`, Infinity)
      fScore.set(`${x},${y}`, Infinity)
    }
  }
  gScore.set(start, 0)

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  fScore.set(start, h(start))

  while (!openSet.isEmpty()) {
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
    const current = openSet.pop() //the node in openSet having the lowest fScore[] value

    if (current === goal) {
      return true
      //return reconstruct_path(cameFrom, current)
    }

    // openSet.delete(current)
    const neighbors = getNeighbors(current)
    for (const neighbor of neighbors) {
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      const tentative_gScore = gScore.get(current)! + d(current, neighbor)

      if (tentative_gScore < gScore.get(neighbor)!) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom.set(neighbor, current)
        gScore.set(neighbor, tentative_gScore)
        fScore.set(neighbor, tentative_gScore + h(neighbor))
        //if (!openSet.(neighbor)) {
        openSet.push(neighbor)
        //}
      }
    }
  }

  // Open set is empty but goal was never reached
  return Infinity
}

const main = (input: string, maxX = 70, maxY = 70) => {
  const objects: Wall[] = []

  input
    .trim()
    .split('\n')
    .forEach((line) => {
      const [x, y] = line.split(',').map((c) => parseInt(c, 10))
      objects.push(new Wall(x, y, objects.length))
    })

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
    const score = calculateResult(grid, maxX, maxY, mid)

    if (score === Infinity) {
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
