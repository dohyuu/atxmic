import { describe, expect, it, vi } from "vitest"
import { createTransactionalClient } from "./client"

describe("createTransactionalClient", () => {
  it("should create a transactional client", () => {
    const client = {
      find: vi.fn(),
      $transaction: vi.fn(),
    }
    const transactional = createTransactionalClient(client, client.$transaction)

    transactional.find()
    transactional._transaction(async () => {})

    expect(transactional.find).toBeCalled()
    expect(transactional.$transaction).toBeCalled()
    expect(transactional._transaction).toBeCalled()
  })
})
