import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 4', () => {
  test('Question 1', () => {
    const input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`
    expect(funcQ1(input)).toEqual(41)
  })
  test('Question 1 (custom input)', () => {
    const input = `
....##....
.....#....
......#...
.....^....
..........
..........
..........
..........
..........
..........`
    expect(funcQ1(input)).toEqual(8)
  })
  test('Question 2', () => {
    const input = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`
    expect(funcQ2(input)).toEqual(6)
  })
})
