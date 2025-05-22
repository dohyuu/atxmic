import { describe, expect, it } from "vitest"
import { internalTransaction } from "./proxy"
import { createTestTx } from "./utils/test"

describe("createProxy", () => {
  it("should use existing transaction", async () => {})
  it("should use new transaction", async () => {})
  it("should use stored transaction in transaction", async () => {})
})

describe("internalTransaction", () => {
  it("should return handler", () => {
    const tx = createTestTx()
    const handler = internalTransaction(tx)
    expect(handler).toBeInstanceOf(Function)
  })

  it("should handle single promise", async () => {
    const tx = createTestTx()
    const handler = internalTransaction(tx)
    const result = await handler(Promise.resolve(1))
    expect(result).toEqual([1])
  })

  it("should handle array of promises", async () => {
    const tx = createTestTx()
    const handler = internalTransaction(tx)
    const result = await handler([Promise.resolve(1), Promise.resolve(2)])
    expect(result).toEqual([1, 2])
  })

  it("should handle multiple promises", async () => {
    const tx = createTestTx()
    const handler = internalTransaction(tx)
    const result = await handler(Promise.resolve(1), Promise.resolve(2))
    expect(result).toEqual([1, 2])
  })

  it("should handle function", async () => {
    const tx = createTestTx()
    const handler = internalTransaction(tx)
    const result = await handler(async (tx) => {
      return tx.find()
    })
    expect(result).toBe("find")
  })

  it("should throw error if not a promise or function", async () => {
    const tx = createTestTx()
    const handler = internalTransaction(tx)
    await expect(handler(1 as any)).rejects.toThrow()
  })
})
