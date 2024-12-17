import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 17', () => {
  test('Question 1', () => {
    const input = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`
    expect(funcQ1(input)).toEqual('4,6,3,5,6,3,5,2,1,0')
  })
  test.skip('Question 2', () => {
    const input = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`
    expect(funcQ2(input)).toEqual(117440)
  })
})
