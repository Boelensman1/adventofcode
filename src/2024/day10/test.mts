import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 9', () => {
  test('Question 1', () => {
    const input = `
    89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`
    expect(funcQ1(input)).toEqual(36)
  })
  test('Question 1 (small input)', () => {
    const input = `
0123
1234
8765
9876`
    expect(funcQ1(input)).toEqual(1)
  })
  test('Question 1 (other input)', () => {
    const input = `
10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`
    expect(funcQ1(input)).toEqual(3)
  })
  test('Question 2', () => {
    const input = `
    89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`
    expect(funcQ2(input)).toEqual(81)
  })
})
