import { TransactionStorage } from "atxmic"
import { describe, expect, it } from "vitest"
import { CLIENT_KEY, INTERNAL_CLIENT_KEY } from "../constants"
import { TestClient } from "../test/utils"
import { createExistingProvider } from "./existing"
import { createFactoryProvider } from "./factory"
import { createTypeProvider } from "./type"
import { createValueProvider } from "./value"

describe("createTypeProvider", () => {
  it("should contain TransactionStorage", () => {
    const provider = createTypeProvider(TestClient)
    expect(provider).toContain(TransactionStorage)
  })

  it("should contain provided client", () => {
    const provider = createTypeProvider(TestClient)
    expect(provider).toContainEqual({
      provide: TestClient,
      useExisting: CLIENT_KEY,
    })
  })

  it("should contain CLIENT_KEY", () => {
    const provider = createTypeProvider(TestClient)
    expect(provider).toContainEqual(
      expect.objectContaining({
        provide: CLIENT_KEY,
      }),
    )
  })

  it("should contain provided internal client", () => {
    const provider = createTypeProvider(TestClient)
    expect(provider).toContainEqual(
      expect.objectContaining({
        provide: INTERNAL_CLIENT_KEY,
      }),
    )
  })
})

describe("createValueProvider", () => {
  it("should contain TransactionStorage", () => {
    const provider = createValueProvider({
      provide: TestClient,
      useValue: new TestClient(),
    })
    expect(provider).toContain(TransactionStorage)
  })

  it("should contain provided client", () => {
    const value = new TestClient()
    const provider = createValueProvider({
      provide: TestClient,
      useValue: value,
    })

    expect(provider).toContainEqual(
      expect.objectContaining({
        provide: TestClient,
        useFactory: expect.any(Function),
      }),
    )
  })

  it("should contain CLIENT_KEY", () => {
    const provider = createValueProvider({
      provide: TestClient,
      useValue: new TestClient(),
    })
    expect(provider).toContainEqual(
      expect.objectContaining({ provide: CLIENT_KEY }),
    )
  })

  it("should contain provided internal client", () => {
    const provider = createValueProvider({
      provide: TestClient,
      useValue: new TestClient(),
    })

    expect(provider).toContainEqual(
      expect.objectContaining({
        provide: INTERNAL_CLIENT_KEY,
      }),
    )
  })
})

describe("createFactoryProvider", () => {
  it("should contain TransactionStorage", () => {
    const provider = createFactoryProvider({
      provide: TestClient,
      useFactory: () => new TestClient(),
    })
    expect(provider).toContain(TransactionStorage)
  })

  it("should contain provided client", () => {
    const provider = createFactoryProvider({
      provide: TestClient,
      useFactory: () => new TestClient(),
    })

    expect(provider).toContainEqual(
      expect.objectContaining({
        provide: TestClient,
        useFactory: expect.any(Function),
      }),
    )
  })

  it("should contain CLIENT_KEY", () => {
    const provider = createFactoryProvider({
      provide: TestClient,
      useFactory: () => new TestClient(),
    })
    expect(provider).toContainEqual(
      expect.objectContaining({ provide: CLIENT_KEY }),
    )
  })

  it("should contain provided internal client", () => {
    const provider = createFactoryProvider({
      provide: TestClient,
      useFactory: () => new TestClient(),
    })

    expect(provider).toContainEqual(
      expect.objectContaining({
        provide: INTERNAL_CLIENT_KEY,
      }),
    )
  })
})

describe("createExistingProvider", () => {
  it("should contain TransactionStorage", () => {
    const provider = createExistingProvider({
      provide: TestClient,
      useExisting: TestClient,
    })
    expect(provider).toContain(TransactionStorage)
  })

  it("should contain provided client", () => {
    const provider = createExistingProvider({
      provide: TestClient,
      useExisting: TestClient,
    })

    expect(provider).toContainEqual(
      expect.objectContaining({
        provide: TestClient,
        useFactory: expect.any(Function),
      }),
    )
  })

  it("should contain CLIENT_KEY", () => {
    const provider = createExistingProvider({
      provide: TestClient,
      useExisting: TestClient,
    })
    expect(provider).toContainEqual(
      expect.objectContaining({ provide: CLIENT_KEY, useExisting: TestClient }),
    )
  })

  it("should not contain provided internal client", () => {
    const provider = createExistingProvider({
      provide: TestClient,
      useExisting: TestClient,
    })

    expect(provider).not.toContainEqual(
      expect.objectContaining({
        provide: INTERNAL_CLIENT_KEY,
      }),
    )
  })
})
