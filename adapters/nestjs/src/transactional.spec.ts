import { Inject, Injectable } from "@nestjs/common"
import { Test, type TestingModule } from "@nestjs/testing"
import { TransactionStorage, transaction } from "atxmic"
import { describe, expect, it, vi } from "vitest"
import { CLIENT_KEY } from "./constants"
import { Transactional } from "./transactional"

class Transaction {
  async find() {
    return "find"
  }
}

@Injectable()
class Client extends Transaction {
  async $transaction<O>(fn: (tx: Transaction) => Promise<O>) {
    return fn(this)
  }
}

@Injectable()
class TestService {
  constructor(@Inject(CLIENT_KEY) private readonly client: Client) {}

  @Transactional()
  async test() {
    return this.client.find()
  }
}

describe("Transational", () => {
  it("should call transaction function ", async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TestService,
        TransactionStorage,
        {
          provide: CLIENT_KEY,
          useClass: Client,
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
