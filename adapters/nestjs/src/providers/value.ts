import type { Provider, ValueProvider } from "@nestjs/common"
import { TransactionStorage } from "atxmic"
import { CLIENT_KEY, INTERNAL_CLIENT_KEY } from "../constants"
import { provideProxyClient } from "./utils"

export function createValueProvider(client: ValueProvider): Provider[] {
  return [
    {
      provide: INTERNAL_CLIENT_KEY,
      useValue: client.useValue,
    },
    provideProxyClient({
      provide: client.provide,
      internalClientKey: INTERNAL_CLIENT_KEY,
      transactionStorageKey: TransactionStorage,
    }),
    {
      provide: CLIENT_KEY,
      useExisting: client.provide,
    },
    TransactionStorage,
  ]
}
