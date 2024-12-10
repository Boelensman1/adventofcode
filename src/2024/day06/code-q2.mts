interface Coordinate {
  x: number
  y: number
}
type Obstacles = Coordinate[]
enum Direction {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}

const getFirstObstacleHit = (
  obstacles: Obstacles,
  position: Coordinate,
  direction: Direction,
) => {
  let firstObstacle: Coordinate | null = null
  for (const obstacle of obstacles) {
    switch (direction) {
      case Direction.Left:
        if (
          obstacle.y === position.y &&
          obstacle.x < position.x &&
          (!firstObstacle || firstObstacle.x <= obstacle.x)
        ) {
          firstObstacle = { x: obstacle.x, y: obstacle.y }
        }
        break

      case Direction.Right:
        if (
          obstacle.y === position.y &&
          obstacle.x > position.x &&
          (!firstObstacle || firstObstacle.x >= obstacle.x)
        ) {
          firstObstacle = { x: obstacle.x, y: obstacle.y }
        }
        break
      case Direction.Up:
        if (
          obstacle.x === position.x &&
          obstacle.y < position.y &&
          (!firstObstacle || firstObstacle.y <= obstacle.y)
        ) {
          firstObstacle = { x: obstacle.x, y: obstacle.y }
        }
        break
      case Direction.Down:
        if (
          obstacle.x === position.x &&
          obstacle.y > position.y &&
          (!firstObstacle || firstObstacle.y >= obstacle.y)
        ) {
          firstObstacle = { x: obstacle.x, y: obstacle.y }
        }
        break
    }
  }
  return firstObstacle
}

const moveOneStep = (position: Coordinate, direction: Direction) => {
  switch (direction) {
    case Direction.Left:
      return { x: position.x - 1, y: position.y }
    case Direction.Right:
      return { x: position.x + 1, y: position.y }
    case Direction.Up:
      return { x: position.x, y: position.y - 1 }
    case Direction.Down:
      return { x: position.x, y: position.y + 1 }
  }
}
const getNewGuardPosition = (
  obstacles: Obstacles,
  position: Coordinate,
  direction: Direction,
) => {
  const firstObstacleHit = getFirstObstacleHit(obstacles, position, direction)
  if (firstObstacleHit) {
    return moveOneStep(firstObstacleHit, (direction + 2) % 4) // move one step back
  }
  return null
}

const main = (input: string) => {
  const lines = input.trim().split('\n')
  const sizeX = lines[0].length
  const sizeY = lines.length

  let guardPosition: Coordinate
  let guardDirection = Direction.Up

  const obstacles = lines.flatMap((line, y) =>
    line.split('').reduce((obstaclesInLine, char, x) => {
      if (char === '#') {
        obstaclesInLine.push({ x, y })
      }
      if (char === '^') {
        guardPosition = { x, y }
      }
      return obstaclesInLine
    }, [] as Obstacles),
  )
  const obstaclesSet = new Set(
    obstacles.map((obstacle) => obstacle.x + '|' + obstacle.y),
  )

  const initialGuardPosition = guardPosition!
  const initialGuardDirection = Direction.Up

  const possibleObstaclesForLoop = new Set<string>()
  for (let x = 0; x < sizeX; x += 1) {
    for (let y = 0; y < sizeY; y += 1) {
      const newObstacle = { x, y }
      const newObstacleString = newObstacle.x + '|' + newObstacle.y
      if (
        obstaclesSet.has(newObstacleString) ||
        (newObstacle.x === initialGuardPosition.x &&
          newObstacle.y === initialGuardPosition.y)
      ) {
        continue
      }

      guardPosition = initialGuardPosition
      guardDirection = initialGuardDirection

      let j = 0
      let newGuardPosition
      let loopFound = false
      obstacles.push(newObstacle)

      while (
        (newGuardPosition = getNewGuardPosition(
          obstacles,
          guardPosition,
          guardDirection,
        )) !== null &&
        !loopFound
      ) {
        j += 1
        if (j > 1000) {
          possibleObstaclesForLoop.add(newObstacleString)
          loopFound = true
        }
        guardPosition = newGuardPosition
        guardDirection = (guardDirection + 1) % 4 // turn 90 degrees right
      }
      obstacles.pop()
    }
  }

  return possibleObstaclesForLoop.size
}

export default main
// between 1800 and 1977
