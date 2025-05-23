import { Inject, Injectable } from "@nestjs/common"
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
}

@Injectable()
export class TestService {
  constructor(@Inject(CLIENT_KEY) private readonly client: TestClient) {}

  @Transactional()
  async test() {
    return this.client.find()
  }
}
