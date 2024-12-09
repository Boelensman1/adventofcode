import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 3', () => {
  test('Question 1', () => {
    const input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`
    expect(funcQ1(input)).toEqual(161)
  })
  test('Question 2', () => {
    const input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`
    expect(funcQ2(input)).toEqual(48)
  })
})
