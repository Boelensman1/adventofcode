import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 1', () => {
  test('Question 1', () => {
    const input = `3   4
4   3
2   5
1   3
3   9
3   3`
    expect(funcQ1(input)).toEqual(11)
  })
  test('Question 2', () => {
    const input = `3   4
4   3
2   5
1   3
3   9
3   3`
    expect(funcQ2(input)).toEqual(31)
  })
})
