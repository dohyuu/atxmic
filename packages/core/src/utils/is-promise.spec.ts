import { describe, expect, it } from "vitest"
import { isPromise } from "./is-promise"

describe("isPromise", () => {
  it("should return true if the input is a promise", () => {
    expect(isPromise(Promise.resolve())).toBe(true)
  })

  it("should return true if the input is a promise", () => {
    expect(isPromise(new Promise(() => {}))).toBe(true)
  })

  it("should return false if the input is not a promise", () => {
    expect(isPromise(1)).toBe(false)
  })
})
