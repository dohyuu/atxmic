import { Injectable, Module } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { TransactionStorage } from "atxmic"
import { describe, expect, it } from "vitest"
import { CLIENT_KEY } from "./constants"
import { TransactionModule } from "./module"
import { TestClient, TestTransaction } from "./test/utils"

describe("TransactionModule", () => {
  it("should export necessary providers", async () => {
    const module = await Test.createTestingModule({
      imports: [
        TransactionModule.register({
          client: TestClient,
        }),
      ],
    }).compile()

    expect(module).toBeDefined()
    expect(module.get(TransactionStorage)).toBeInstanceOf(TransactionStorage)
    expect(module.get(TestClient)).toBeInstanceOf(TestClient)
    expect(module.get(CLIENT_KEY)).toBeInstanceOf(TestClient)
  })

  it("should override a client", async () => {
    @Injectable()
    class OverriddenClient extends TestTransaction {
      async $transaction<O>(fn: (tx: TestTransaction) => Promise<O>) {
        return fn(this)
      }
    }

    @Module({
      providers: [TestClient],
      exports: [TestClient],
    })
    class OtherModule {}

    const module = await Test.createTestingModule({
      imports: [
        OtherModule,
        TransactionModule.register({
          client: {
            provide: TestClient,
            useClass: OverriddenClient,
          },
        }),
      ],
    }).compile()

    const client = module.get(TestClient)
    expect(client).toBeInstanceOf(OverriddenClient)
  })
})
