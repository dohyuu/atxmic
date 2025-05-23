import { Injectable } from "@nestjs/common"
import { describe, expect, it } from "vitest"
import { TestClient } from "../test/utils"
import {
  isClassProvider,
  isFactoryProvider,
  isTypeProvider,
  isValueProvider,
} from "./assert"

describe("isTypeProvider", () => {
  it("should return true when type provider given", () => {
    expect(isTypeProvider(TestClient)).toBe(true)
  })

  it("should return false when value provider given", () => {
    expect(isTypeProvider({ provide: "test", useValue: "test" })).toBe(false)
  })
})

describe("isClassProvider", () => {
  it("should return true when class provider given", () => {
    expect(
      isClassProvider({
        provide: "test",
        useClass: TestClient,
      }),
    ).toBe(true)
  })

  it("should return false when value provider given", () => {
    expect(isClassProvider({ provide: "test", useValue: "test" })).toBe(false)
  })

  it("should return false when factory provider given", () => {
    expect(isClassProvider({ provide: "test", useFactory: () => "test" })).toBe(
      false,
    )
  })
})

describe("isValueProvider", () => {
  it("should return true when value provider given", () => {
    expect(isValueProvider({ provide: "test", useValue: "test" })).toBe(true)
  })

  it("should return false when type provider given", () => {
    expect(isValueProvider(TestClient)).toBe(false)
  })
})

describe("isFactoryProvider", () => {
  it("should return true when factory provider given", () => {
    expect(
      isFactoryProvider({ provide: "test", useFactory: () => "test" }),
    ).toBe(true)
  })

  it("should return false when type provider given", () => {
    expect(isFactoryProvider(TestClient)).toBe(false)
  })

  it("should return false when class provider given", () => {
    @Injectable()
    class Mock {}

    expect(isFactoryProvider({ provide: "test", useClass: Mock })).toBe(false)
  })
})
