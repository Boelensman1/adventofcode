import { describe, test, expect } from 'vitest'

import funcQ1 from './code-q1.mjs'
import funcQ2 from './code-q2.mjs'

describe('Day 15', () => {
  test('Question 1 (small example)', () => {
    const input = `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`
    expect(funcQ1(input)).toEqual(2028)
  })
  test('Question 1', () => {
    const input = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`
    expect(funcQ1(input)).toEqual(10092)
  })
  test('Question 2 (smaller input)', () => {
    const input = `
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
`
    expect(funcQ2(input)).toEqual(618)
  })
  test('Question 2', () => {
    const input = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`
    expect(funcQ2(input)).toEqual(9021)
  })

  test('Question 2 (reddit test case 1)', () => {
    const input = `
#######
#.....#
#.....#
#.@O..#
#..#O.#
#...O.#
#..O..#
#.....#
#######

>><vvv>v>^^^
`
    expect(funcQ2(input)).toEqual(1430)
  })

  test('Question 2 (reddit testcase 2)', () => {
    const input = `
#######
#.....#
#.OO@.#
#.....#
#######

<<
`
    expect(funcQ2(input)).toEqual(406)
  })

  test('Question 2 (reddit testcase 3)', () => {
    const input = `
#######
#.....#
#.O#..#
#..O@.#
#.....#
#######

<v<<^
`
    expect(funcQ2(input)).toEqual(509)
  })

  test('Question 2 (reddit testcase 4)', () => {
    const input = `
  #######
#.....#
#.#O..#
#..O@.#
#.....#
#######

<v<^
`
    expect(funcQ2(input)).toEqual(511)
  })

  test('Question 2 (reddit testcase 5)', () => {
    const input = `
    ######
#....#
#.O..#
#.OO@#
#.O..#
#....#
######

<vv<<^
`
    expect(funcQ2(input)).toEqual(816)
  })

  test('Question 2 (reddit testcase 6)', () => {
    const input = `
    #######
#...#.#
#.....#
#.....#
#.....#
#.....#
#.OOO@#
#.OOO.#
#..O..#
#.....#
#.....#
#######

v<vv<<^^^^^
`
    expect(funcQ2(input)).toEqual(2339)
  })

  test('Question 2 (reddit testcase 7)', () => {
    const input = `
    ########
#......#
#..O...#
#.O....#
#..O...#
#@O....#
#......#
########

>>^<^>^^>>>>v<<^<<<vvvvv>>
`
    expect(funcQ2(input)).toEqual(1420)
  })

  test('Question 2 (reddit testcase 8)', () => {
    const input = `
    ########
#......#
#..O...#
#.O....#
#..O...#
#@O....#
#......#
########

>>^<^>^^>>>>v<<^<<<vvvvv>>^
`
    expect(funcQ2(input)).toEqual(1020)
  })

  test('Question 2 (reddit testcase 9)', () => {
    const input = `
  ########
#......#
#OO....#
#.O....#
#.O....#
##O....#
#O..O@.#
#......#
########

<^^<<>^^^<v
`
    expect(funcQ2(input)).toEqual(2827)
  })

  test('Question 2 (reddit testcase 10)', () => {
    const input = `
  ########
#......#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

>>>vv><^^^>vv
`
    expect(funcQ2(input)).toEqual(1833)
  })
})
