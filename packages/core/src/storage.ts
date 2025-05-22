import { AsyncLocalStorage } from "node:async_hooks"
import type {
  StorageValue,
  TransactionalClient,
  TransactionalStorage,
  TransactionOf,
} from "./types"

export class TransactionStorage<
    Client extends TransactionalClient<Tx>,
    Tx extends Record<string, unknown> = TransactionOf<Client>,
  >
  extends AsyncLocalStorage<StorageValue<Client, Tx>>
  implements TransactionalStorage<Client, Tx> {}

export const createStorage = <
  Client extends TransactionalClient<Tx>,
  Tx extends Record<string, unknown> = TransactionOf<Client>,
>(): TransactionalStorage<Client, Tx> => {
  return new TransactionStorage<Client, Tx>()
}
