import type { Provider, Type } from "@nestjs/common"
import {
  type TransactionalClient,
  type TransactionOf,
  TransactionStorage,
} from "atxmic"
import { CLIENT_KEY, INTERNAL_CLIENT_KEY } from "../constants"
import { provideProxyClient } from "./utils"

export function createTypeProvider<
  T extends TransactionalClient<Tx>,
  Tx extends Record<string, unknown> = TransactionOf<T>,
>(client: Type): Provider[] {
  return [
    {
      provide: INTERNAL_CLIENT_KEY,
      useClass: client,
    },
    provideProxyClient({
      provide: CLIENT_KEY,
      internalClientKey: INTERNAL_CLIENT_KEY,
      transactionStorageKey: TransactionStorage,
    }),
    { provide: client, useExisting: CLIENT_KEY },
    TransactionStorage,
  ]
}
