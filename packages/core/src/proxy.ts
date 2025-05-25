import type { PayloadOf, TransactionalClient } from "./types"
import { isPromise } from "./utils/is-promise"

export function createProxy<
  T extends TransactionalClient<Tx>,
  Tx extends object,
>(client: PayloadOf<T, Tx>): T {
  return new Proxy(client.client, {
    get(_, prop, receiver) {
      const tx = client.storage.getStore()?.transaction
      if (prop === "_transaction" && tx) {
        return internalTransaction(tx)
      }

      const target = client.storage.getStore()?.transaction || client.client
      return Reflect.get(target, prop, receiver)
    },
  }) as unknown as T
}

export const internalTransaction = <Tx extends object>(tx: Tx) =>
  async function _transaction<T>(
    callback:
      | Promise<T>
      | Array<Promise<T>>
      | ((transaction: Tx) => Promise<T>),
    ...args: Array<Promise<T>>
  ) {
    if (typeof callback === "function") {
      return callback(tx)
    }

    if (Array.isArray(callback)) {
      return Promise.all(callback)
    }

    if (isPromise(callback) && (args.length === 0 || Array.isArray(args))) {
      return Promise.all([callback, ...args])
    }

    throw new Error("Unsupported transaction call")
  }
