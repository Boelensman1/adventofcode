/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */
import { init } from 'z3-solver'

/*
2,4:  B <- A & 7
1,1:  B <- B ^ 1
7,5:  C <- A >> B
0,3:  A <- A >> 3
1,4:  B <- B ^ 4
4,5:  B <- B ^ C
5,5;  out += B & 7
3,0:  jmp to 0
*/

/*

  while (registers.A !== 0n) {
    // combined and simplified program
    registers.B =
      (registers.A & 7n) ^ 5n ^ (registers.A >> ((registers.A & 7n) ^ 1n))
    // registers.C = registers.A >>(registers.B ^ 4n)
    registers.C = registers.A >> registers.B
    registers.A = registers.A >> 3n

    out.push(Number(registers.B & 7n))
  }
  */

const main = async (_input: string) => {
  const { Context } = await init()

  const { Optimize, BitVec } = Context('main')

  const solver = new Optimize()

  const expectedOut = [2, 4, 1, 1, 7, 5, 0, 3, 1, 4, 4, 5, 5, 5, 3, 0]
  const steps = expectedOut.length

  const A = []
  const B = []
  const C = []

  for (let i = 0; i <= steps; i++) {
    A.push(BitVec.const(`A${i}`, 64))
    if (i < steps) {
      B.push(BitVec.const(`B${i}`, 64))
      C.push(BitVec.const(`C${i}`, 64))
    }
  }

  // Step 0: Initial constraints
  solver.add(A[0].sgt(BitVec.val(0, 64))) // A0 > 0

  for (let i = 0; i < steps; i++) {
    // B_i = (A_i & 7) ^ 5 ^ (A_i >> ((A_i & 7) ^ 1))
    const shiftAmount = A[i].and(7).xor(1)
    solver.add(B[i].eq(A[i].and(7).xor(5).xor(A[i].shr(shiftAmount))))

    // C_i = A_i >> B_i
    solver.add(C[i].eq(A[i].shr(B[i])))

    // A_{i+1} = A_i >> 3
    solver.add(A[i + 1].eq(A[i].shr(3)))

    // Constraint on the output
    solver.add(B[i].and(7).eq(BitVec.val(expectedOut[i], 64)))
  }

  // Final stopping condition: A[steps] == 0
  solver.add(A[steps].eq(BitVec.val(0, 64)))

  // Minimize A[0]
  // @ts-expect-error no idea how to fix the typing
  solver.minimize(A[0])

  // Check satisfiability
  const result = await solver.check()
  if (result === 'sat') {
    const model = solver.model()
    return Number(model.eval(A[0]).value())
  } else {
    return -1
  }
}

export default main
