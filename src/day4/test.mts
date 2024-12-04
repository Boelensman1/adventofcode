import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 4', () => {
  test('Question 1', () => {
    const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`
    expect(funcQ1(input)).toEqual(18)
  })
  test('Question 2', () => {
    const input = `.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`
    expect(funcQ2(input)).toEqual(9)
  })
  test('Question 2 (no padding)', () => {
    const input = `.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.`
    expect(funcQ2(input)).toEqual(9)
  })
})
