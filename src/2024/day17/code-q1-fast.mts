type Register = 'A' | 'B' | 'C'
type Registers = Record<Register, bigint>

/*
program:
2,4:  B <- A & 7
1,1:  B <- B ^ 1
7,5:  C <- A >> B
0,3:  A <- A >> 3
1,4:  B <- B ^ 4
4,5:  B <- B ^ C
5,5;  out += B & 7
3,0:  jmp to 0
*/

export const parseInput = (input: string) => {
  // @ts-expect-error will be filled later
  const registers: Registers = {}

  input.split('\n').forEach((line) => {
    if (line.startsWith('Register')) {
      const registerChar = line['Register '.length] as Register
      const [, val] = line.split(': ')
      registers[registerChar] = BigInt(parseInt(val, 10))
    }
  })

  return { registers }
}

export const run = (registers: Registers) => {
  const out: number[] = []

  while (registers.A !== 0n) {
    // combined and simplified program
    registers.B =
      (registers.A & 7n) ^ 5n ^ (registers.A >> ((registers.A & 7n) ^ 1n))
    // registers.C = registers.A >>(registers.B ^ 4n)
    registers.C = registers.A >> registers.B
    registers.A = registers.A >> 3n

    out.push(Number(registers.B & 7n))
  }

  return out
}

const main = (input: string) => {
  const { registers } = parseInput(input)

  return run(registers).join(',')
}

export default main
