import { type Prisma, PrismaClient } from "@prisma/client"
import { describe, expect, expectTypeOf, it, vi } from "vitest"
import { prismaAdapter } from "./adapter"
import type { PrismaTransactionOf } from "./type"

describe("prismaAdapter", () => {
  describe("with instance", () => {
    it("should accept PrismaClient", () => {
      prismaAdapter(new PrismaClient())
    })

    it("should start transaction", async () => {
      const prisma = new PrismaClient()
      const transactional = prismaAdapter(prisma)
      const tx = vi.spyOn((prisma as any)._engine, "transaction")

      transactional._transaction(async () => {
        return "test"
      })

      expect(tx.mock.lastCall?.[0]).toEqual("start")
    })

    it("should rollback transaction when error is thrown", async () => {
      const prisma = new PrismaClient()
      const transactional = prismaAdapter(prisma)
      const tx = vi.spyOn((prisma as any)._engine, "transaction")

      try {
        await transactional._transaction(async () => {
          throw new Error("test")
        })
      } catch (e) {}

      expect(tx.mock.lastCall?.[0]).toEqual("rollback")
    })

    it("should commit transaction when no error is thrown", async () => {
      const prisma = new PrismaClient()
      const transactional = prismaAdapter(prisma)
      const tx = vi.spyOn((prisma as any)._engine, "transaction")
      const result = await transactional._transaction(async () => {
        return true
      })

      expect(result).toEqual(true)
      expect(tx.mock.lastCall?.[0]).toEqual("commit")
    })
  })

  describe("with class", () => {
    it("should accept PrismaClient", () => {
      prismaAdapter(PrismaClient)
    })

    it("should start transaction", async () => {
      const transactional = prismaAdapter(PrismaClient)
      const prisma = new transactional()
      const tx = vi.spyOn((prisma as any)._engine, "transaction")

      prisma._transaction(async () => {
        return "test"
      })

      expect(tx.mock.lastCall?.[0]).toEqual("start")
    })

    it("should rollback transaction when error is thrown", async () => {
      const transactional = prismaAdapter(PrismaClient)
      const prisma = new transactional()
      const tx = vi.spyOn((prisma as any)._engine, "transaction")

      try {
        await prisma._transaction(async () => {
          throw new Error("test")
        })
      } catch (e) {}

      expect(tx.mock.lastCall?.[0]).toEqual("rollback")
    })

    it("should commit transaction when no error is thrown", async () => {
      const transactional = prismaAdapter(PrismaClient)
      const prisma = new transactional()
      const tx = vi.spyOn((prisma as any)._engine, "transaction")
      const result = await prisma._transaction(async () => {
        return true
      })

      expect(result).toEqual(true)
      expect(tx.mock.lastCall?.[0]).toEqual("commit")
    })
  })

  describe("with class extend", () => {
    it("should start transaction", async () => {
      class ExtendedPrismaClient extends prismaAdapter(PrismaClient) {}
      const prisma = new ExtendedPrismaClient()
      const tx = vi.spyOn((prisma as any)._engine, "transaction")
      prisma._transaction(async () => {
        return "test"
      })

      expect(tx.mock.lastCall?.[0]).toEqual("start")
    })

    it("should rollback transaction when error is thrown", async () => {
      class ExtendedPrismaClient extends prismaAdapter(PrismaClient) {}
      const prisma = new ExtendedPrismaClient()
      const tx = vi.spyOn((prisma as any)._engine, "transaction")

      try {
        await prisma._transaction(async () => {
          throw new Error("test")
        })
      } catch (e) {}

      expect(tx.mock.lastCall?.[0]).toEqual("rollback")
    })

    it("should commit transaction when no error is thrown", async () => {
      class ExtendedPrismaClient extends prismaAdapter(PrismaClient) {}
      const prisma = new ExtendedPrismaClient()
      const tx = vi.spyOn((prisma as any)._engine, "transaction")
      const result = await prisma._transaction(async () => {
        return true
      })

      expect(result).toEqual(true)
      expect(tx.mock.lastCall?.[0]).toEqual("commit")
    })
  })
})

describe("PrismaTransactionOf", () => {
  it("should infer the correct transaction type", () => {
    expectTypeOf<
      PrismaTransactionOf<PrismaClient>
    >().toEqualTypeOf<Prisma.TransactionClient>()
  })
})
