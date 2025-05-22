import { randomUUID } from "node:crypto"
import { describe, expect, it } from "vitest"
import { transaction } from "./transaction"
import { identifyClient } from "./utils/identify"
import { initTest } from "./utils/test"

describe("transaction", () => {
  it("should run with new transaction", async () => {
    const id = randomUUID()
    const { tx, client, als } = initTest()

    const identified = identifyClient(tx, () => id)
    als.enterWith({
      transaction: identified,
    })

    const payload = {
      storage: als,
      client,
    }

    const result = await transaction(payload, async (tx) => {
      return tx.id
    })

    expect(result).toBe(id)
  })

  it("should use new transaction when no stored transaction", async () => {
    const { client, als } = initTest()
    const payload = {
      client,
      storage: als,
    }

    const result = await transaction(payload, async () => {
      const storage = als.getStore()

      return !!storage?.transaction
    })

    expect(result).toBe(true)
  })

  it("should use stored transaction", async () => {
    const { tx, client, als } = initTest()
    const id = randomUUID()
    const identified = identifyClient(tx, () => id)
    als.enterWith({
      transaction: identified,
    })

    const payload = {
      storage: als,
      client,
    }

    const result = await transaction(payload, async () => {
      const storage = als.getStore()
      return storage?.transaction.id
    })

    expect(result).toBe(id)
  })

  it("should use same transaction in nested calls", async () => {
    const { tx, client, als } = initTest()
    const identified = identifyClient(tx)
    const payload = {
      client,
      storage: als,
    }

    als.enterWith({
      transaction: identified,
    })

    const [id1, id2] = await transaction(payload, async () => {
      const id1 = await transaction(payload, async (tx) => {
        return tx.id
      })

      const id2 = await transaction(payload, async () => {
        const storage = als.getStore()
        return storage?.transaction.id
      })

      return [id1, id2]
    })

    expect(id1).toBe(id2)
  })

  it("should use different transaction", async () => {
    const { client, als } = initTest()

    const payload = {
      client,
      storage: als,
    }

    const result = await transaction(payload, async () => {
      const storage = als.getStore()
      return storage?.transaction.id
    })

    const result2 = await transaction(payload, async () => {
      const storage = als.getStore()
      return storage?.transaction.id
    })

    expect(result).not.toBe(result2)
  })
})
