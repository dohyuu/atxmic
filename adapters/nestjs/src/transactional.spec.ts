import { Test, type TestingModule } from "@nestjs/testing"
import { TransactionStorage } from "atxmic"
import { describe, expect, it, vi } from "vitest"
import { CLIENT_KEY } from "./constants"
import { TestClient, TestService, TestServiceWrapper } from "./test/utils"

describe("Transational", () => {
  it("should call atomic transaction", async () => {
    const client = new TestClient()
    const spy = vi.spyOn(client, "_atomicTransaction")
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TestService,
        TransactionStorage,
        {
          provide: CLIENT_KEY,
          useValue: client,
        },
        TestServiceWrapper,
      ],
    }).compile()

    const service = module.get<TestServiceWrapper>(TestServiceWrapper)
    await service.successfulTransaction()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it("should rollback transaction when error occurs", async () => {
    const client = new TestClient()
    const spy = vi.spyOn(client, "_atomicTransaction")
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TestService,
        TransactionStorage,
        {
          provide: CLIENT_KEY,
          useValue: client,
        },
        TestServiceWrapper,
      ],
    }).compile()

    const service = module.get<TestServiceWrapper>(TestServiceWrapper)
    expect(service.failedTransaction()).rejects.toThrow()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it("should rollback transaction when error occurs in nested transaction", async () => {
    const client = new TestClient()
    const spy = vi.spyOn(client, "_atomicTransaction")
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TestService,
        TransactionStorage,
        {
          provide: CLIENT_KEY,
          useValue: client,
        },
        TestServiceWrapper,
      ],
    }).compile()

    const service = module.get<TestServiceWrapper>(TestServiceWrapper)
    expect(service.nestedFailedTransaction()).rejects.toThrow()
  })
})
