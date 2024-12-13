interface Plot {
  x: number
  y: number
  type: string
}

enum Facing {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

interface Edge {
  x: number
  y: number
  facing: Facing
}

interface Region {
  type: string
  area: number
  edges: Edge[]
}

const edgeIsNextTo = (edge1: Edge, edge2: Edge) => {
  if (edge1.x == edge2.x) {
    return Math.abs(edge1.y - edge2.y) == 1 && edge1.facing == edge2.facing
  }
  if (edge1.y == edge2.y) {
    return Math.abs(edge1.x - edge2.x) == 1 && edge1.facing == edge2.facing
  }
  return false
}

const getSides = (edges: Edge[]): number => {
  let t = edges.length
  let i = 0
  while (i + 1 < edges.length) {
    for (let j = i + 1; j < edges.length; j++) {
      if (edgeIsNextTo(edges[i], edges[j])) {
        t -= 1
      }
    }
    i += 1
  }

  return t
}

const getRegion = (
  plot: Plot,
  plots: Plot[][],
  unprocessedPlots: (Plot | null)[][],
  region: Region = {
    type: '',
    area: 0,
    edges: [],
  },
): Region | null => {
  if (unprocessedPlots[plot.y][plot.x] === null) {
    // already processed
    return null
  }

  region.type = plot.type
  region.area += 1

  const edges: Edge[] = [
    { x: plot.x, y: plot.y, facing: Facing.LEFT },
    { x: plot.x, y: plot.y, facing: Facing.RIGHT },
    { x: plot.x, y: plot.y, facing: Facing.UP },
    { x: plot.x, y: plot.y, facing: Facing.DOWN },
  ]

  unprocessedPlots[plot.y][plot.x] = null

  // check plots around
  const plotsAround = [
    plots[plot.y][plot.x - 1], // left
    plots[plot.y][plot.x + 1], // right
    plots[plot.y - 1] ? plots[plot.y - 1][plot.x] : null, // up
    plots[plot.y + 1] ? plots[plot.y + 1][plot.x] : null, // down
  ].filter((plotAround, i): plotAround is Plot => {
    const connected = plotAround && plotAround.type === plot.type

    if (!connected) {
      region.edges.push(edges[i])
    }

    return connected
  })

  plotsAround.forEach((plotAround) => {
    if (unprocessedPlots[plotAround.y][plotAround.x]) {
      getRegion(plotAround, plots, unprocessedPlots, region)
    }
  })

  return region
}

const main = (input: string) => {
  const lines = input.trim().split('\n')
  const plots = lines
    .map((line) => line.split(''))
    .map((line, y) =>
      line.map((type, x) => ({
        x,
        y,
        type,
      })),
    )

  const regions: Region[] = []
  const unprocessedPlots = [...plots.map((l) => [...l])]
  for (const line of plots) {
    for (const plot of line) {
      const region = getRegion(plot, plots, unprocessedPlots)
      if (region) {
        regions.push(region)
      }
    }
  }

  return regions.reduce((acc, region) => {
    const sides = getSides(region.edges)
    return acc + region.area * sides
  }, 0)
}

export default main
