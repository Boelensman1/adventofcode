type Type = 'none' | 'BoxLeft' | 'BoxRight' | 'Wall' | 'Robot'
type Grid = (Object | null)[][]

abstract class ObjectBase {
  public readonly type: Type = 'none'

  constructor(
    public x: number,
    public y: number,
  ) {}
}

export class BoxLeft extends ObjectBase {
  public readonly type = 'BoxLeft'
  public readonly icon = '['
  public joinedBox!: BoxRight

  constructor(
    public x: number,
    public y: number,
  ) {
    super(x, y)
  }

  get GPS() {
    return this.x + this.y * 100
  }
}

export class BoxRight extends ObjectBase {
  public readonly type = 'BoxRight'
  public readonly icon = ']'

  constructor(
    public x: number,
    public y: number,
    public joinedBox: BoxLeft,
  ) {
    super(x, y)
  }
}

class Wall extends ObjectBase {
  public readonly type = 'Wall'
  public readonly icon = '#'
}

export class Robot extends ObjectBase {
  public readonly type = 'Robot'
  public readonly icon = '@'
}

type Object = BoxLeft | BoxRight | Wall | Robot

type Direction = '<' | 'v' | '^' | '>'

const drawGrid = (grid: Grid) => {
  const maxX = grid[0].length

  console.log(
    '',
    new Array<string>(maxX + 2)
      .fill('')
      .map((_, x) => (x > 0 && x % 2 === 1 ? String(x - 1).padEnd(2, ' ') : ''))
      .join(''),
  )

  let hasError = false

  grid.forEach((line, y) => {
    console.log(
      [
        y,
        ...line.map((c, x) => {
          if (!c) {
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
        }),
      ].join(''),
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

const isBox = (obj: Object | null): obj is BoxLeft | BoxRight =>
  !!obj && (obj.type === 'BoxLeft' || obj.type === 'BoxRight')

const getBoxStack = (
  boxStack: Set<BoxRight | BoxLeft>,
  grid: Grid,
  direction: Direction,
) => {
  const { x, y } = getDeltaXY(direction)
  let boxesToCheck = [...boxStack.values()]
  let oldSize = -1

  while (oldSize !== boxStack.size) {
    oldSize = boxStack.size
    const newBoxes = []
    for (const box of boxesToCheck) {
      const objAtLocation = grid[box.y + y][box.x + x]
      if (isBox(objAtLocation)) {
        newBoxes.push(objAtLocation)
        newBoxes.push(objAtLocation.joinedBox)
        boxStack.add(objAtLocation)
        boxStack.add(objAtLocation.joinedBox)
      }
    }
    boxesToCheck = newBoxes
  }

  return boxStack
}

const doMove = (move: Direction, robot: Robot, grid: Grid) => {
  // get object that we move into
  const { x, y } = getDeltaXY(move)
  const objectMovedInto = grid[robot.y + y][robot.x + x]
  if (!objectMovedInto) {
    // empty space!
    grid[robot.y][robot.x] = null
    robot.x += x
    robot.y += y
    grid[robot.y][robot.x] = robot
    return
  }

  if (objectMovedInto.type === 'Wall') {
    // Wall, don't move!
    return
  }

  if (objectMovedInto.type === 'Robot') {
    throw new Error('We moved into ourselves??')
  }

  // we ran into boxes, we have to shove
  const boxStack = [
    ...getBoxStack(
      new Set([objectMovedInto, objectMovedInto.joinedBox]),
      grid,
      move,
    ).values(),
  ]

  // check if all boxes can move
  const canMove = !boxStack.some((box) => {
    const objAtLocation = grid[box.y + y][box.x + x]
    return objAtLocation?.type === 'Wall'
  })
  if (!canMove) {
    // some of the boxes would move into a wall, don't move
    return
  }

  // move boxes
  for (const box of boxStack) {
    grid[box.y][box.x] = null
    box.x += x
    box.y += y
  }

  for (const box of boxStack) {
    grid[box.y][box.x] = box
  }

  // move robot
  grid[robot.y][robot.x] = null
  robot.x += x
  robot.y += y
  grid[robot.y][robot.x] = robot
}

const debug = false

const main = (input: string) => {
  const objects: Object[] = []
  const moves: Direction[] = []

  let robot: Robot
  input
    .trim()
    .split('\n')
    .forEach((line, y) => {
      line.split('').forEach((char, x) => {
        if (char === '.') {
          return
        }

        switch (char) {
          case 'O': {
            const boxLeft = new BoxLeft(x * 2, y)
            const boxRight = new BoxRight(x * 2 + 1, y, boxLeft)
            boxLeft.joinedBox = boxRight
            objects.push(...[boxLeft, boxRight])
            return
          }
          case '#': {
            const walls = [new Wall(x * 2, y), new Wall(x * 2 + 1, y)]
            objects.push(...walls)
            return
          }
          case '@': {
            robot = new Robot(x * 2, y)
            objects.push(robot)
            return
          }
          default:
            moves.push(char as Direction)
        }
      })
    })

  if (!robot!) {
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

  moves.reverse()

  let move
  while ((move = moves.pop()) !== undefined) {
    if (debug) {
      console.log(
        '\n----------------------------\n',
        'Below is status after move',
        move,
        '',
        robot.x,
        robot.y,
      )
    }
    doMove(move, robot, grid)
    if (debug) drawGrid(grid)
  }

  return objects.reduce((acc, obj) => {
    if (obj.type !== 'BoxLeft') {
      return acc
    }
    return acc + obj.GPS
  }, 0)
}

export default main
