type Register = 'A' | 'B' | 'C'
export type Registers = Record<Register, bigint>
export type Program = number[]
type Output = number[]

export const parseInput = (input: string) => {
  // @ts-expect-error will be filled later
  const registers: Registers = {}

  const program: Program = []
  input.split('\n').forEach((line) => {
    if (line.startsWith('Register')) {
      const registerChar = line['Register '.length] as Register
      const [, val] = line.split(': ')
      registers[registerChar] = BigInt(parseInt(val, 10))
    }

    if (line.startsWith('Program: ')) {
      const [, vals] = line.split(': ')
      vals.split(',').forEach((val) => program.push(parseInt(val, 10)))
    }
  })

  return { registers, program }
}

const debug = false

const runInstruction = (
  instructionPointer: number,
  instruction: number,
  listeralOperand: bigint,
  comboOperand: bigint,
  registers: Registers,
  out: Output,
) => {
  if (debug) {
    console.log({
      instructionPointer,
      instruction,
      listeralOperand,
      comboOperand,
      registers,
      out,
    })
  }
  switch (instruction) {
    case 0: {
      // The adv instruction (opcode 0) performs division. The numerator is the value in the A register. The denominator is found by raising 2 to the power of the instruction's combo operand. (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is truncated to an integer and then written to the A register.
      //const numerator = registers.A
      // const denominator = 2 ** comboOperand
      // registers.A = Math.floor(numerator / denominator)
      registers.A = registers.A >> comboOperand // same as above
      break
    }
    case 1:
      // The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.
      registers.B = registers.B ^ listeralOperand
      break
    case 2:
      // The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits), then writes that value to the B register.
      registers.B = comboOperand & 7n
      break
    case 3:
      // The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand; if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
      if (registers.A !== 0n) {
        return Number(listeralOperand)
      }
      break
    case 4:
      // The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
      registers.B = registers.B ^ registers.C
      break
    case 5:
      // The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)
      out.push(Number(comboOperand & 7n))
      break
    case 6: {
      // The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)
      // const numerator = registers.A
      // const denominator = 2 ** comboOperand
      // registers.B = Math.floor(numerator / denominator)
      registers.B = registers.A >> comboOperand // same as above
      break
    }
    case 7: {
      // The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)
      // const numerator = registers.A
      // const denominator = 2 ** comboOperand
      // registers.C = Math.floor(numerator / denominator)
      registers.C = registers.A >> comboOperand // same as above
      break
    }
  }

  return instructionPointer + 2
}

const step = (
  instructionPointer: number,
  program: Program,
  registers: Registers,
  out: Output,
) => {
  if (instructionPointer >= program.length) {
    return -1 // halt
  }

  const instruction = program[instructionPointer]
  const listeralOperand = program[instructionPointer + 1]

  let comboOperand
  switch (listeralOperand) {
    case 0:
    case 1:
    case 2:
    case 3:
      comboOperand = BigInt(listeralOperand)
      break
    case 4:
      comboOperand = registers.A
      break
    case 5:
      comboOperand = registers.B
      break
    case 6:
      comboOperand = registers.C
      break
    default:
      throw new Error(`Unknown combo operand ${listeralOperand}`)
  }

  return runInstruction(
    instructionPointer,
    instruction,
    BigInt(listeralOperand),
    comboOperand,
    registers,
    out,
  )
}

export const run = (registers: Registers, program: Program) => {
  const out: number[] = []

  let instructionPointer = 0
  while (instructionPointer !== -1) {
    instructionPointer = step(instructionPointer, program, registers, out)
  }

  return out
}

const main = (input: string) => {
  const { registers, program } = parseInput(input)

  return run(registers, program).join(',')
}

export default main
