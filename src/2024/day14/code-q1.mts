interface Coordinate {
  x: number
  y: number
}

interface Velocity {
  x: number
  y: number
}

interface Robot {
  position: Coordinate
  velocity: Velocity
}

const steps = 100

const getQuadrantAtEnd = (robot: Robot, width: number, height: number) => {
  const minX = (robot.position.x + robot.velocity.x * steps) % width
  const minY = (robot.position.y + robot.velocity.y * steps) % height

  const x = (minX + (Math.abs(minX) % width) * width) % width
  const y = (minY + (Math.abs(minY) % height) * height) % height

  if (x === (width - 1) / 2 || y === (height - 1) / 2) {
    // exactly in the middle, doesn't count
    return -1
  }

  const left = x < width / 2
  const top = y < height / 2

  if (left) {
    return top ? 0 : 2
  } else {
    return top ? 1 : 3
  }
}

const main = (input: string, width = 101, height = 103) => {
  const robots = input
    .trim()
    .split('\n')
    .map((line): Robot => {
      const match = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/.exec(line)!
      return {
        position: { x: parseInt(match[1], 10), y: parseInt(match[2], 10) },
        velocity: { x: parseInt(match[3], 10), y: parseInt(match[4], 10) },
      }
    })

  const quadrantCounts = [0, 0, 0, 0]
  robots
    .map((robot) => getQuadrantAtEnd(robot, width, height))
    .forEach((quadrant) => {
      if (quadrant !== -1) {
        quadrantCounts[quadrant] += 1
      }
    })

  const firstCount = quadrantCounts.pop()!
  return quadrantCounts.reduce(
    (acc, quadrantCount) => acc * quadrantCount,
    firstCount,
  )
}

export default main
