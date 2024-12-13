import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 11', () => {
  test('Question 1 (ex1)', () => {
    const input = `
AAAA
BBCD
BBCC
EEEC`
    expect(funcQ1(input)).toEqual(140)
  })
  test('Question 1 (ex2)', () => {
    const input = `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`
    expect(funcQ1(input)).toEqual(772)
  })
  test('Question 1 (ex3)', () => {
    const input = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`
    expect(funcQ1(input)).toEqual(1930)
  })
  test('Question 2 (ex1)', () => {
    const input = `
AAAA
BBCD
BBCC
EEEC`
    expect(funcQ2(input)).toEqual(80)
  })
  test('Question 2 (ex2)', () => {
    const input = `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`
    expect(funcQ2(input)).toEqual(436)
  })
  test('Question 2 (ex3)', () => {
    const input = `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`
    expect(funcQ2(input)).toEqual(236)
  })
  test('Question 2 (ex4)', () => {
    const input = `
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`
    expect(funcQ2(input)).toEqual(368)
  })
  test('Question 2 (ex5)', () => {
    const input = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`
    expect(funcQ2(input)).toEqual(1206)
  })
})
