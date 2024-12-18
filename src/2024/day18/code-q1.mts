type Type = 'none' | 'You' | 'Wall'
type Grid = (Object | null)[][]

abstract class ObjectBase {
  public readonly type: Type = 'none'

  constructor(
    public x: number,
    public y: number,
  ) {}

  get coordString() {
    return `${this.x},${this.y}`
  }
}

class Wall extends ObjectBase {
  public readonly type = 'Wall'
  public readonly icon = '#'
}

class You extends ObjectBase {
  public readonly type = 'You'
  public readonly icon = '@'
}

type Object = Wall | You

type VisitedMap = Map<string, number>

type Direction = '<' | 'v' | '^' | '>'

interface Coordinate {
  x: number
  y: number
}

const drawGrid = (grid: Grid, path: Coordinate[]) => {
  grid.forEach((line, y) => {
    console.log(
      line
        .map((c, x) => {
          if (!c) {
            if (path.some((coord) => coord.x === x && coord.y === y)) {
              return 'O'
            }
            return '.'
          }
          return c.icon
        })
        .join(''),
    )
  })
}

const getDeltaXY = (direction: Direction) => {
  const x = {
    '<': -1,
    v: 0,
    '^': 0,
    '>': 1,
  }[direction]
  const y = {
    '<': 0,
    v: 1,
    '^': -1,
    '>': 0,
  }[direction]
  return { x, y }
}

const doMove = (
  you: You,
  direction: Direction,
  maxX: number,
  maxY: number,
  grid: Grid,
) => {
  // get object that we move into
  const { x, y } = getDeltaXY(direction)

  if (you.x + x < 0 || you.x + x > maxX || you.y + y < 0 || you.y + y > maxY) {
    // can't move outside the grid
    return false
  }

  if (grid[you.y + y][you.x + x]?.type === 'Wall') {
    // can't move into a wall
    return false
  }

  // move
  grid[you.y][you.x] = null
  you.x += x
  you.y += y
  grid[you.y][you.x] = you

  return true
}

const undoMove = (
  you: You,
  direction: Direction,
  maxX: number,
  maxY: number,
  grid: Grid,
) => {
  const oppositeDirection: Record<Direction, Direction> = {
    '<': '>',
    v: '^',
    '^': 'v',
    '>': '<',
  }

  doMove(you, oppositeDirection[direction], maxX, maxY, grid)
}

const debug = false

const calculateResult = (
  grid: Grid,
  you: You,
  visited: VisitedMap,
  maxX: number,
  maxY: number,
  score = 0,
) => {
  if (you.x === maxX && you.y === maxY) {
    return score
  }
  if ((visited.get(you.coordString) ?? Infinity) <= score) {
    // loop!
    return Infinity
  }
  visited.set(you.coordString, score)

  if (debug) {
    drawGrid(
      grid,
      [...visited.keys()].map((v) => ({
        x: parseInt(v.split(',')[0], 10),
        y: parseInt(v.split(',')[1], 10),
      })),
    )
    console.log('dist:', `${Math.abs(you.x - maxX) + Math.abs(you.y - maxY)}!`)
    console.log('')
  }

  // move!
  const options: number[] = []
  // option 1, >
  if (doMove(you, '>', maxX, maxY, grid)) {
    options.push(calculateResult(grid, you, visited, maxX, maxY, score + 1))
    undoMove(you, '>', maxX, maxY, grid)
  }
  // option 2, v
  if (doMove(you, 'v', maxX, maxY, grid)) {
    options.push(calculateResult(grid, you, visited, maxX, maxY, score + 1))
    undoMove(you, 'v', maxX, maxY, grid)
  }

  // option 3, <
  if (doMove(you, '<', maxX, maxY, grid)) {
    options.push(calculateResult(grid, you, visited, maxX, maxY, score + 1))
    undoMove(you, '<', maxX, maxY, grid)
  }

  // option 4, ^
  if (doMove(you, '^', maxX, maxY, grid)) {
    options.push(calculateResult(grid, you, visited, maxX, maxY, score + 1))
    undoMove(you, '^', maxX, maxY, grid)
  }

  return Math.min(...options)
}

const main = (input: string, maxX = 70, maxY = 70, bytes = 1024) => {
  const objects: Object[] = []

  input
    .trim()
    .split('\n')
    .forEach((line, i) => {
      if (i >= bytes) {
        return
      }

      const [x, y] = line.split(',').map((c) => parseInt(c, 10))
      objects.push(new Wall(x, y))
    })

  const grid: Grid = new Array(maxY + 1)
    .fill([])
    .map(() => new Array<Object | null>(maxX + 1).fill(null))
  objects.forEach((obj) => {
    grid[obj.y][obj.x] = obj
  })

  const you = new You(0, 0)

  if (debug) {
    console.log('START')
  }
  return calculateResult(grid, you, new Map(), maxX, maxY)
}

export default main
