import { AsyncLocalStorage } from "node:async_hooks"
import { describe, expect, it } from "vitest"
import { createStorage } from "./storage"

describe("storage", () => {
  it("should create storage", () => {
    const storage = createStorage()
    expect(storage).toBeInstanceOf(AsyncLocalStorage)
  })
})
