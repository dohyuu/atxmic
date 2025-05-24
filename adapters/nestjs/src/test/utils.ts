import { Inject, Injectable } from "@nestjs/common"
import { transaction } from "atxmic"
import { CLIENT_KEY } from "../constants"
import { Transactional } from "../transactional"

export class TestTransaction {
  async find() {
    return "find"
  }
}

@Injectable()
export class TestClient extends TestTransaction {
  async $transaction<O>(fn: (tx: TestTransaction) => Promise<O>) {
    return fn(this)
  }

  _atomicTransaction = transaction
  _transaction = this.$transaction
}

@Injectable()
export class TestService {
  constructor(@Inject(CLIENT_KEY) private readonly client: TestClient) {}

  @Transactional()
  async transactional() {
    return this.client.find()
  }

  @Transactional()
  async failedTransactional() {
    throw new Error("test error")
  }

  async occurError() {
    throw new Error("test error")
  }

  async nonTransactional() {
    return this.client.find()
  }
}

@Injectable()
export class TestServiceWrapper {
  constructor(@Inject(TestService) private readonly service: TestService) {}

  @Transactional()
  async successfulTransaction() {
    await this.service.nonTransactional()
    const res = await this.service.nonTransactional()
    return res
  }

  @Transactional()
  async failedTransaction() {
    await this.service.nonTransactional()
    await this.service.occurError()
    const res = await this.service.nonTransactional()
    return res
  }

  @Transactional()
  async nestedTransaction() {
    await this.service.transactional()
    const res = await this.service.transactional()
    return res
  }

  @Transactional()
  async nestedFailedTransaction() {
    await this.service.transactional()
    await this.service.failedTransactional()
    const res = await this.service.transactional()
    return res
  }
}
