abstract class ObjectBase {
  constructor(
    public x: number,
    public y: number,
  ) {}

  distanceTo(obj: Object) {
    return Math.abs(this.x - obj.x) + Math.abs(this.y - obj.y)
  }
}

class Box extends ObjectBase {
  public readonly type = 'Box'
  public readonly icon = 'O'

  get GPS() {
    return this.x + this.y * 100
  }
}

class Wall extends ObjectBase {
  public readonly type = 'Wall'
  public readonly icon = '#'
}

class Robot extends ObjectBase {
  public readonly type = 'Robot'
  public readonly icon = '@'
}

type Object = Box | Wall | Robot

type Direction = '<' | 'v' | '^' | '>'

const dirIsHor = (dir: Direction) => dir === '>' || dir === '<'

const getClassForChar = (char: string) => {
  return {
    '#': Wall,
    O: Box,
    '@': Robot,
  }[char]
}

const drawGrid = (objects: Object[]) => {
  const maxX = objects.reduce((acc, obj) => (acc < obj.x ? obj.x : acc), 0)
  const maxY = objects.reduce((acc, obj) => (acc < obj.y ? obj.y : acc), 0)

  const grid = new Array<string[]>(maxY + 1)
    .fill([])
    .map(() => new Array<string>(maxX + 1).fill('.'))
  objects.forEach((obj) => {
    if (grid[obj.y][obj.x] !== '.') {
      console.log(
        `Duplicate object at grid position ${obj.x},${obj.y}, has "${grid[obj.y][obj.x]}", trying to place "${obj.icon}"`,
      )
    }
    grid[obj.y][obj.x] = obj.icon
  })

  console.log(
    new Array<string>(maxX + 2)
      .fill('')
      .map((_, x) => (x > 0 ? x - 1 : ' '))
      .join(''),
  )
  grid.forEach((line, y) => {
    console.log([y, ...line].join(''))
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

const getObjectsInDir = (
  robot: Robot,
  objects: Object[],
  direction: Direction,
) => {
  const objectsInDir = objects.filter((obj) => {
    if (obj.type === 'Robot') {
      return false
    }
    if (dirIsHor(direction)) {
      return (
        robot.y === obj.y &&
        (direction === '>' ? robot.x < obj.x : robot.x > obj.x)
      )
    }
    return (
      robot.x === obj.x &&
      (direction === '^' ? robot.y > obj.y : robot.y < obj.y)
    )
  })

  const { x, y } = getDeltaXY(direction)
  objectsInDir.sort((a, b) => (a.x - b.x) * x + (a.y - b.y) * y)

  return objectsInDir
}

const doMove = (move: Direction, robot: Robot, objects: Object[]) => {
  const { x, y } = getDeltaXY(move)

  // check if we can move
  const objectsInDir = getObjectsInDir(robot, objects, move)

  const firtObjInDir = objectsInDir[0]
  if (firtObjInDir.distanceTo(robot) > 1) {
    // nothing adjecent, just move
    robot.x += x
    robot.y += y
    return
  }

  if (firtObjInDir.type === 'Wall') {
    // running into a wall, don't move
    return
  }

  const boxesInStack: Box[] = []
  for (const obj of objectsInDir) {
    if (
      obj.type !== 'Box' ||
      (boxesInStack.length > 0 &&
        obj.distanceTo(boxesInStack[boxesInStack.length - 1]) > 1)
    ) {
      break
    }
    boxesInStack.push(obj)
  }

  const firstWallAfterBoxes = objectsInDir.find((obj) => obj.type === 'Wall')!
  if (
    firstWallAfterBoxes.distanceTo(boxesInStack[boxesInStack.length - 1]) === 1
  ) {
    // wall after the boxes, don't move
    return
  }

  // move boxes
  for (const box of boxesInStack) {
    box.x += x
    box.y += y
  }
  // move robot
  robot.x += x
  robot.y += y
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

        const ObjClass = getClassForChar(char)
        if (ObjClass) {
          const newObj = new ObjClass(x, y)
          objects.push(newObj)

          if (newObj.type === 'Robot') {
            robot = newObj
          }
        } else {
          moves.push(char as Direction)
        }
      })
    })

  if (!robot!) {
    throw new Error('Failed to parse input')
  }

  if (debug) {
    drawGrid(objects)
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
      )
    }

    doMove(move, robot, objects)
    if (debug) drawGrid(objects)
  }

  return objects.reduce((acc, obj) => {
    if (obj.type !== 'Box') {
      return acc
    }
    return acc + obj.GPS
  }, 0)
}

export default main
