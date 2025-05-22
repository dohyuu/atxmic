import { randomUUID } from "node:crypto"
import { describe, expect, it } from "vitest"
import { createProxy, internalTransaction } from "./proxy"
import { identifyClient } from "./utils/identify"
import { createTestTx, initTest } from "./utils/test"

describe("createProxy", () => {
  it("should use existing transaction", async () => {
    const { client, tx, als } = initTest()
    const proxyClient = createProxy({
      client,
      storage: als,
    })
    const id = randomUUID()
    const identified = identifyClient(tx, () => id)
    als.enterWith({
      transaction: identified,
    })

    const result = (proxyClient as any).id
    expect(result).toBe(id)
  })

  it("should use new transaction", async () => {
    const { client, als } = initTest()
    const proxyClient = createProxy({
      client,
      storage: als,
    })

    const id = (proxyClient as any).id
    expect(id).toBeUndefined()
  })

  it("should use stored transaction in transaction", async () => {
    const { client, als } = initTest()
    const proxyClient = createProxy({
      client,
      storage: als,
    })

    const id = await proxyClient._transaction(async (tx) => {
      return (tx as any).id
    })
    expect(id).toBeDefined()
  })
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
