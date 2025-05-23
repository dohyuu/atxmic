import type { ExistingProvider, Provider } from "@nestjs/common"
import { TransactionStorage } from "atxmic"
import { CLIENT_KEY } from "../constants"
import { provideProxyClient } from "./utils"

export function createExistingProvider(client: ExistingProvider): Provider[] {
  return [
    provideProxyClient({
      provide: client.provide,
      internalClientKey: client.useExisting,
      transactionStorageKey: TransactionStorage,
    }),
    { provide: CLIENT_KEY, useExisting: client.useExisting },
    TransactionStorage,
  ]
}
