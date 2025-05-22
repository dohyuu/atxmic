import { isPromise } from "./utils/is-promise"

export const internalTransaction = <Tx extends Record<string, unknown>>(
  tx: Tx,
) =>
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
