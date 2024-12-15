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

const getPositionAtEnd = (
  robot: Robot,
  width: number,
  height: number,
  steps: number,
) => {
  const minX = (robot.position.x + robot.velocity.x * steps) % width
  const minY = (robot.position.y + robot.velocity.y * steps) % height

  const x = (minX + (Math.abs(minX) % width) * width) % width
  const y = (minY + (Math.abs(minY) % height) * height) % height

  return { x, y }
}

const drawGrid = (grid: number[][]) => {
  grid.forEach((line) => {
    console.log(line.map((l) => (l === 0 ? ' ' : l)).join(''))
  })
}

const runAndPrintIfClustered = (
  robots: Robot[],
  width = 101,
  height = 103,
  steps: number,
) => {
  const positions = robots.map((robot) =>
    getPositionAtEnd(robot, width, height, steps),
  )

  const averageX =
    positions.reduce((acc, robot) => (acc += robot.x), 0) / robots.length
  const averageY =
    positions.reduce((acc, robot) => (acc += robot.y), 0) / robots.length
  const spread = positions.reduce(
    (acc, robot) =>
      (acc += Math.abs(robot.x - averageX) + Math.abs(robot.y - averageY)),
    0,
  )

  if (spread < 15000) {
    const grid = new Array<number[]>(height)
      .fill([])
      .map(() => new Array<number>(width).fill(0))
    positions.forEach((robot) => (grid[robot.y][robot.x] += 1))
    drawGrid(grid)
  }
  return spread
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

  let minSpread = Infinity
  let minSpreadAt = -1
  for (let steps = 0; steps < 10000; steps += 1) {
    const spread = runAndPrintIfClustered(robots, width, height, steps)
    if (spread < minSpread) {
      minSpread = spread
      minSpreadAt = steps
    }
  }
  return minSpreadAt
}

export default main
