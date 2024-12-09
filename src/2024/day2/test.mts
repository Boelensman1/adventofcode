import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 2', () => {
  test('Question 1 (small)', () => {
    const input = `7 6 4 2 1`
    expect(funcQ1(input)).toEqual(1)
  })
  test('Question 1', () => {
    const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`
    expect(funcQ1(input)).toEqual(2)
  })
  test('Question 2', () => {
    const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`
    expect(funcQ2(input)).toEqual(4)
  })
})
