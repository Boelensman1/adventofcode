interface Plot {
  x: number
  y: number
  type: string
}

interface Region {
  area: number
  perimeter: number
}

const getRegion = (
  plot: Plot,
  plots: Plot[][],
  unprocessedPlots: (Plot | null)[][],
  region = {
    area: 0,
    perimeter: 0,
  },
): Region | null => {
  if (unprocessedPlots[plot.y][plot.x] === null) {
    // already processed
    return null
  }

  region.area += 1
  region.perimeter += 4

  unprocessedPlots[plot.y][plot.x] = null

  // check plots around
  const plotsAround = [
    plots[plot.y][plot.x - 1], // left
    plots[plot.y][plot.x + 1], // right
    plots[plot.y - 1] ? plots[plot.y - 1][plot.x] : null, // up
    plots[plot.y + 1] ? plots[plot.y + 1][plot.x] : null, // down
  ].filter((plotAround) => plotAround && plotAround.type === plot.type)

  region.perimeter -= plotsAround.length

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

  return regions.reduce(
    (acc, region) => acc + region.area * region.perimeter,
    0,
  )
}

export default main
