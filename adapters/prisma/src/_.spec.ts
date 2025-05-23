import { type Prisma, PrismaClient } from "@prisma/client"
import { describe, expectTypeOf, it } from "vitest"
import { prismaAdapter } from "./adapter"
import type { PrismaTransactionOf } from "./type"

describe("prismaAdapter", () => {
  it("should accept PrismaClient", () => {
    prismaAdapter(new PrismaClient())
  })
})

describe("PrismaTransactionOf", () => {
  it("should infer the correct transaction type", () => {
    expectTypeOf<
      PrismaTransactionOf<PrismaClient>
    >().toEqualTypeOf<Prisma.TransactionClient>()
  })
})
