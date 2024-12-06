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

/*
const printDirection = (direction: Direction) =>
  ['Up', 'Right', 'Down', 'Left'][direction]
  */

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

const getFinalGuardPosition = (
  position: Coordinate,
  direction: Direction,
  sizeX: number,
  sizeY: number,
) => {
  switch (direction) {
    case Direction.Left:
      return { x: 0, y: position.y }
    case Direction.Right:
      return { x: sizeX - 1, y: position.y }
    case Direction.Up:
      return { x: position.x, y: 0 }
    case Direction.Down:
      return { x: position.x, y: sizeY - 1 }
  }
}

const getPositionsBetween = (oldPos: Coordinate, newPos: Coordinate) => {
  const positionBetween = []
  for (
    let x = Math.min(oldPos.x, newPos.x);
    x <= Math.max(oldPos.x, newPos.x);
    x += 1
  ) {
    positionBetween.push(`${x}|${oldPos.y}`)
  }
  for (
    let y = Math.min(oldPos.y, newPos.y);
    y <= Math.max(oldPos.y, newPos.y);
    y += 1
  ) {
    positionBetween.push(`${oldPos.x}|${y}`)
  }
  return positionBetween
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

  let newGuardPosition
  const positionsVisited = new Set<string>()
  while (
    (newGuardPosition = getNewGuardPosition(
      obstacles,
      guardPosition!,
      guardDirection,
    )) !== null
  ) {
    getPositionsBetween(guardPosition!, newGuardPosition).forEach(
      (position) => {
        positionsVisited.add(position)
      },
    )

    guardPosition = newGuardPosition
    guardDirection = (guardDirection + 1) % 4 // turn 90 degrees right
  }

  // walking of the map
  newGuardPosition = getFinalGuardPosition(
    guardPosition!,
    guardDirection,
    sizeX,
    sizeY,
  )

  getPositionsBetween(guardPosition!, newGuardPosition).forEach((position) => {
    positionsVisited.add(position)
  })

  return positionsVisited.size
}

export default main
