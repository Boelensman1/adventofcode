import q1 from './code-q1.mjs'

type Type = 'none' | 'Reindeer' | 'Wall' | 'EndTile'
type Grid = (Object | null)[][]
type PathsWithScore = [number, Coordinate[]][]

interface Coordinate {
  x: number
  y: number
}

abstract class ObjectBase {
  public readonly type: Type = 'none'

  constructor(
    public x: number,
    public y: number,
  ) {}

  get coord(): Coordinate {
    return { x: this.x, y: this.y }
  }
}

class Wall extends ObjectBase {
  public readonly type = 'Wall'
  public readonly icon = '#'
}

class Reindeer extends ObjectBase {
  public readonly type = 'Reindeer'
  public readonly icon = '@'

  public facing: Direction = '>'

  get coordString() {
    return `${this.x},${this.y},${this.facing}`
  }
}

class EndTile extends ObjectBase {
  public readonly type = 'EndTile'
  public readonly icon = 'E'
}

type Object = Wall | Reindeer | EndTile

type Direction = '<' | 'v' | '^' | '>'

type VisitedMap = Map<string, number>

const drawGrid = (grid: Grid, path: Coordinate[] = []) => {
  let hasError = false

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
          if (c.x !== x || c.y !== y) {
            console.log('Object coordinates not in sync with grid', c, {
              x,
              y,
            })
            hasError = true
          }
          return c.icon
        })
        .join(''),
    )
  })

  if (hasError) {
    throw new Error('Error while drawing grid.')
  }
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

const doMove = (reindeer: Reindeer, grid: Grid) => {
  // get object that we move into
  const { x, y } = getDeltaXY(reindeer.facing)

  if (grid[reindeer.y + y][reindeer.x + x]?.type === 'Wall') {
    // can't move into a wall
    return false
  }

  // move reindeer
  grid[reindeer.y][reindeer.x] = null
  reindeer.x += x
  reindeer.y += y
  grid[reindeer.y][reindeer.x] = reindeer

  return true
}

const turnClockwise = (dir: Direction): Direction => {
  const turn: Record<Direction, Direction> = {
    '>': 'v',
    v: '<',
    '<': '^',
    '^': '>',
  }
  return turn[dir]
}
const turnCounterClockwise = (dir: Direction): Direction => {
  return turnClockwise(turnClockwise(turnClockwise(dir)))
}

const undoMove = (reindeer: Reindeer, grid: Grid) => {
  const reverseFacing: Record<Direction, Direction> = {
    '<': '>',
    v: '^',
    '^': 'v',
    '>': '<',
  }

  reindeer.facing = reverseFacing[reindeer.facing]
  doMove(reindeer, grid)
  reindeer.facing = reverseFacing[reindeer.facing]
}

const debug = false

const calculateResult = (
  grid: Grid,
  reindeer: Reindeer,
  endTile: EndTile,
  visited: VisitedMap,
  pathsWithScore: PathsWithScore,
  bestPathScore: number,
  score = 0,
  path: Coordinate[] = [],
) => {
  if (reindeer.x === endTile.x && reindeer.y === endTile.y) {
    pathsWithScore.push([score, path])
    return score
  }
  if (
    (visited.get(reindeer.coordString) ?? Infinity) < score ||
    score > bestPathScore
  ) {
    // loop or already bigger than best
    return Infinity
  }
  visited.set(reindeer.coordString, score)

  // move!
  const options: number[] = []
  // option 1, move in the direction we were going
  if (doMove(reindeer, grid)) {
    options.push(
      calculateResult(
        grid,
        reindeer,
        endTile,
        visited,
        pathsWithScore,
        bestPathScore,
        score + 1,
        [...path, reindeer.coord],
      ),
    )
    undoMove(reindeer, grid)
  }
  // option 2, turn clockwise and then move
  reindeer.facing = turnClockwise(reindeer.facing)
  if (doMove(reindeer, grid)) {
    options.push(
      calculateResult(
        grid,
        reindeer,
        endTile,
        visited,
        pathsWithScore,
        bestPathScore,
        score + 1001,
        [...path, reindeer.coord],
      ),
    )
    undoMove(reindeer, grid)
  }
  reindeer.facing = turnCounterClockwise(reindeer.facing)

  // option 3, turn counterClockwise and then move
  reindeer.facing = turnCounterClockwise(reindeer.facing)
  if (doMove(reindeer, grid)) {
    options.push(
      calculateResult(
        grid,
        reindeer,
        endTile,
        visited,
        pathsWithScore,
        bestPathScore,
        score + 1001,
        [...path, reindeer.coord],
      ),
    )
    undoMove(reindeer, grid)
  }
  reindeer.facing = turnClockwise(reindeer.facing)

  // option 4, turn clockwise twice and then move
  reindeer.facing = turnClockwise(turnClockwise(reindeer.facing))
  if (doMove(reindeer, grid)) {
    options.push(
      calculateResult(
        grid,
        reindeer,
        endTile,
        visited,
        pathsWithScore,
        bestPathScore,
        score + 2001,
        [...path, reindeer.coord],
      ),
    )
    undoMove(reindeer, grid)
  }
  reindeer.facing = turnClockwise(turnClockwise(reindeer.facing))

  return Math.min(...options)
}

const main = (input: string) => {
  const objects: Object[] = []

  let reindeer: Reindeer
  let endTile: EndTile
  input
    .trim()
    .split('\n')
    .forEach((line, y) => {
      line.split('').forEach((char, x) => {
        if (char === '.') {
          return
        }

        switch (char) {
          case 'E': {
            endTile = new EndTile(x, y)
            objects.push(endTile)
            return
          }
          case '#': {
            objects.push(new Wall(x, y))
            return
          }
          case 'S': {
            reindeer = new Reindeer(x, y)
            objects.push(reindeer)
            return
          }
        }
      })
    })

  if (!reindeer! || !endTile!) {
    throw new Error('Failed to parse input')
  }

  const maxX = objects.reduce((acc, obj) => (acc < obj.x ? obj.x : acc), 0)
  const maxY = objects.reduce((acc, obj) => (acc < obj.y ? obj.y : acc), 0)

  const grid: Grid = new Array(maxY + 1)
    .fill([])
    .map(() => new Array<Object | null>(maxX + 1).fill(null))
  objects.forEach((obj) => {
    if (grid[obj.y][obj.x] !== null) {
      throw new Error(
        `Duplicate object at grid position ${obj.x},${obj.y}, has "${grid[obj.y][obj.x]?.icon}", trying to place "${obj.icon}"`,
      )
    }
    grid[obj.y][obj.x] = obj
  })

  if (debug) {
    drawGrid(grid)
    console.log('Initial state\n')
  }

  const bestPathScore = q1(input)

  const pathsWithScore: PathsWithScore = []

  if (
    bestPathScore !==
    calculateResult(
      grid,
      reindeer,
      endTile,
      new Map(),
      pathsWithScore,
      bestPathScore,
    )
  ) {
    throw new Error('Differing result betwen 1 and 2')
  }

  const pathForDrawing: Coordinate[] = []
  const tilesPartOfBestPath = new Set<string>()
  pathsWithScore
    .filter(([s]) => s === bestPathScore)
    .forEach(([, p]) =>
      p.forEach((coord) => {
        tilesPartOfBestPath.add(`${coord.x},${coord.y}`)
        pathForDrawing.push(coord)
      }),
    )

  if (debug) {
    drawGrid(grid, pathForDrawing)
  }

  return tilesPartOfBestPath.size + 1 // end tile
}

export default main