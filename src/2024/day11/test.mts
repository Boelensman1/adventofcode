import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 11', () => {
  test('Question 1', () => {
    const input = `125 17`
    const startTime = performance.now()
    expect(funcQ1(input)).toEqual(55312)
    const endTime = performance.now()
    const executionTime = endTime - startTime
    console.log(`Execution time: ${executionTime.toFixed(2)}ms`)
  })
  test('Question 2', () => {
    const input = `125 17`

    // check correct result
    expect(funcQ2(input, 25)).toEqual(55312)

    // check speed
    let startTime = performance.now()
    funcQ2(input, 26)
    let endTime = performance.now()
    const executionTime1 = endTime - startTime

    startTime = performance.now()
    funcQ2(input, 30)
    endTime = performance.now()
    const executionTime2 = endTime - startTime

    // if runtime is non exponential, the execution time diff should not increase (much)
    expect(executionTime2 / executionTime1).toBeLessThan(3)
  })
})
