import type { FactoryProvider, Provider } from "@nestjs/common"
import { TransactionStorage } from "atxmic"
import { CLIENT_KEY, INTERNAL_CLIENT_KEY } from "../constants"
import { provideProxyClient } from "./utils"

export function createFactoryProvider(client: FactoryProvider): Provider[] {
  return [
    {
      provide: INTERNAL_CLIENT_KEY,
      useFactory: client.useFactory,
      inject: client.inject,
    },
    provideProxyClient({
      provide: client.provide,
      internalClientKey: INTERNAL_CLIENT_KEY,
      transactionStorageKey: TransactionStorage,
    }),
    { provide: CLIENT_KEY, useExisting: client.provide },
    TransactionStorage,
  ]
}
