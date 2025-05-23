import { Test, type TestingModule } from "@nestjs/testing"
import { TransactionStorage, transaction } from "atxmic"
import { describe, expect, it, vi } from "vitest"
import { CLIENT_KEY } from "./constants"
import { TestClient, TestService } from "./test/utils"

describe("Transational", () => {
  it("should call transaction function ", async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TestService,
        TransactionStorage,
        {
          provide: CLIENT_KEY,
          useClass: TestClient,
        },
      ],
    }).compile()

    vi.mock(import("atxmic"), async (importOriginal) => {
      const imports = await importOriginal()
      return {
        ...imports,
        transaction: vi.fn(),
      }
    })

    const service = module.get<TestService>(TestService)
    await service.test()
    expect(transaction).toHaveBeenCalled()
  })
})
