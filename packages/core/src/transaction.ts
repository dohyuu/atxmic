import type {
  Identified,
  PayloadOf,
  StorageValue,
  TransactionalClient,
  TransactionCallback,
} from "./types"
import { identifyClient } from "./utils/identify"

export const transaction = async <
  Client extends TransactionalClient<Tx>,
  Tx extends Record<string, unknown>,
  R,
>(
  payload: PayloadOf<Client, Tx>,
  fn: TransactionCallback<Identified<Tx>, R>,
): Promise<R> => {
  const store = payload.storage.getStore()

  if (store) {
    return fn(store.transaction)
  }

  const task = payload.client._transaction((tx) => {
    const _store: StorageValue<Client, Tx> = {
      transaction: identifyClient(tx),
    }

    return payload.storage.run(_store, () => fn(_store.transaction))
  })

  return task
}
