import type { FactoryProvider, InjectionToken, Provider } from "@nestjs/common"
import {
  createProxy,
  type TransactionalClient,
  type TransactionOf,
  type TransactionStorage,
} from "atxmic"
import { isTypeProvider } from "./assert"

export function getInjectionTokenFromProvider(
  provider: Provider,
): InjectionToken | undefined {
  switch (true) {
    case isTypeProvider(provider):
      return provider
    default:
      return provider.provide
  }
}

export function provideProxyClient<
  T extends TransactionalClient<Tx>,
  Tx extends Record<string, unknown> = TransactionOf<T>,
>(option: {
  provide: InjectionToken
  internalClientKey: InjectionToken
  transactionStorageKey: InjectionToken
}): FactoryProvider<T> {
  return {
    provide: option.provide,
    useFactory: (client: T, storage: TransactionStorage<T, Tx>) => {
      return createProxy({
        storage,
        client,
      })
    },
    inject: [option.internalClientKey, option.transactionStorageKey],
  }
}
