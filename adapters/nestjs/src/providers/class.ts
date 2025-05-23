import type { ClassProvider, Provider } from "@nestjs/common"
import { TransactionStorage } from "atxmic"
import { CLIENT_KEY, INTERNAL_CLIENT_KEY } from "../constants"
import { provideProxyClient } from "./utils"

export function createClassProvider(client: ClassProvider): Provider[] {
  return [
    {
      provide: INTERNAL_CLIENT_KEY,
      useClass: client.useClass,
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
