import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 9', () => {
  test('Question 1 (simple input)', () => {
    const input = `
23223` // 00...11..222 -> 0022211
    expect(funcQ1(input)).toEqual(18 + 11)
  })
  test('Question 1 (slightly less simple input)', () => {
    const input = `
22223` // 00..11..222 -> 0022112
    expect(funcQ1(input)).toEqual(22 + 9)
  })
  test('Question 1 (other test input)', () => {
    const input = `
12345` // 0..111....22222 -> 022111222
    expect(funcQ1(input)).toEqual(60)
  })
  test('Question 1 (another test)', () => {
    const input = `
6732538`
    expect(funcQ1(input)).toEqual(469)
  })
  test('Question 1', () => {
    // 00...111...2...333.44.5555.6666.777.888899
    // ->
    // 0099811188827773336446555566
    const input = `
2333133121414131402`
    expect(funcQ1(input)).toEqual(1928)
  })
  test('Question 2', () => {
    // 00...111...2...333.44.5555.6666.777.888899
    // ->
    // 00992111777.44.333....5555.6666.....8888..
    const input = `
2333133121414131402`
    expect(funcQ2(input)).toEqual(2858)
  })
})
