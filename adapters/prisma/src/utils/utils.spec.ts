import { describe, expect, it } from "vitest"
import { isClass } from "./is-class"

class TestClass {}

describe("isClass", () => {
  it("should return true if the value is a class", () => {
    expect(isClass(TestClass)).toBe(true)
  })

  it("should return false if the value is not a class", () => {
    expect(isClass(new TestClass())).toBe(false)
  })
})
