import { createStorage } from "../storage"
import type { TransactionalClient } from "../types"

export function createTestTx() {
  return {
    find: async () => {
      return "find"
    },
  }
}

export type TestTx = ReturnType<typeof createTestTx>

export function createTestClient(tx: TestTx): TransactionalClient<TestTx> {
  return {
    ...tx,
    _transaction: async <O>(fn: (payload: typeof tx) => Promise<O>) => {
      return fn(tx)
    },
  }
}

export function createTestStorage() {
  return createStorage<TransactionalClient<TestTx>>()
}

export function initTest() {
  const tx = createTestTx()
  const client = createTestClient(tx)
  const als = createTestStorage()

  return {
    tx,
    client,
    als,
  }
}
