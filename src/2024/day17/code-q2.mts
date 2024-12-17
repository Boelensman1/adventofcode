import { run as runq1, parseInput, Program, Registers } from './code-q1.mjs'

/*
2,4,1,1,7,5,0,3,1,4,4,5,5,5,3,0
2,4,1,1,7,5,0,6,7,4,4,5,5,5,3,0


2,4:  B <- A % 8

1,1:  B <- B ^ 1

7,5:  C <- A >> B

0,3:  A <- A >> 3

1,4:  B <- B ^ 4

4,5:  B <- B ^ C

5,5;  out += B % 8

3,0:  jmp to 0

*/

/*
2: 111
4: -
1: 100
1: 100
7: 010
5: 001
0: 101
3: 110
1: 100
4: -     4 4 5
4: -
5: 001
5: 001
5: 001
3: 110
0: 101

// 4,4,5,5,5,3 = 110000000001011010 = 196698
*/
// 110000000001011010101
// 4,4,5,5,5,3,0 = 51571418
// 2,4,1,1,7,5,0,3 = 13642282 = 110100000010101000101010
/*

100100010001101110100 11000100101110101011011010
1,0,0,1,0,0,0,1,0,0,0,1,1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,0,1,0,


1,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,0,

2,4,1,1,7,5,0,3,1 ->
1,0,0,1,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0

4,4,5,5,5,3,0 ->
11000100101110101011011010



2,4,1,1,7,5,0,3,1,4,4,5,5,5,3,0 should be:

1,0,1,1,1,0,0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,
1,0,0,1,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0


almost correct:
101110000000001011010100110 100000010101000101010

correct:
101110000000001011010111101110000010101000101010
*/

const run = (middle: number, registers: Registers, program: Program) => {
  const start = '101110000000001011'
  const end = '000010101000101010'
  const middleBin = middle.toString(2).padStart(12, '0')

  const A = BigInt(parseInt(start + middleBin + end, 2))
  return runq1({ ...registers, A }, program).join(',')
}

const main = (input: string) => {
  const parsedInput = parseInput(input)
  const { program, registers } = parsedInput

  const targetDigits = [...program]
  const targetDigit = targetDigits.pop()
  console.log(targetDigit)

  /*
  registers.A = 197210
  let out = [-1]
  while (
    (out[0] !== 2 ||
      out[1] !== 4 ||
      out[2] !== 1 ||
      out[3] !== 1 ||
      out[4] !== 7 ||
      out[5] !== 5 ||
      out[6] !== 0 ||
      out[7] !== 3) &&
    registers.A < 100000000
  ) {
    registers.A += 1
    out = runq1({ ...registers }, program)
  }
  console.log(registers.A, out)
  */
  /*
  console.log(runq1({ ...registers, A: 202322299857450n }, program).join(','))
  console.log(runq1({ ...registers, A: 80751146n }, program).join(','))
  */

  /*
  const orig = '101110000000001011010100110 100000010101000101010'
  const origN = BigInt(parseInt(orig.replace(' ', ''), 2))

  const test = '101110000000001011010100100 100000010101000101010'
  const testN = BigInt(parseInt(test.replace(' ', ''), 2))

  console.log(runq1({ ...registers, A: origN }, program).join(','))
  console.log(runq1({ ...registers, A: testN }, program).join(','))
  */

  const test = '101110000000001011010111101110000010101000101010'
  console.log(BigInt(parseInt(test, 2)))

  for (let i = 0; i < 4096; i += 1) {
    const out = run(i, registers, program)
    if (out === '2,4,1,1,7,5,0,3,1,4,4,5,5,5,3,0') {
      console.log(i.toString(2).padStart(12, '0'))
      return i
    }
  }

  return registers.A
}

export default main
