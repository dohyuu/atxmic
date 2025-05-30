import type { AsyncLocalStorage } from "node:async_hooks"
import type { IsolationLevel } from "./isolation"

export type TransactionCallback<
  Tx extends object = object,
  Output = unknown,
> = (tx: Tx) => Promise<Output>

export type TransactionRunner<Tx extends object = object, Output = unknown> = <
  O = Output,
>(
  fn: TransactionCallback<Tx, O>,
  options?: {
    isolationLevel?: IsolationLevel
  },
) => Promise<O>

export interface TransactionalClient<Tx extends object = object> {
  _transaction: TransactionRunner<Tx>
  _atomicTransaction: AtomicTransaction
}

export type AtomicTransaction = <
  Client extends TransactionalClient<Tx>,
  Tx extends object,
  R,
>(
  payload: PayloadOf<Client, Tx>,
  fn: TransactionCallback<Identified<Tx>, R>,
) => Promise<R>

export type Identified<T extends object> = T & {
  id: string
}

export type StorageValue<
  C extends TransactionalClient<Tx>,
  Tx extends object = TransactionOf<C>,
> = {
  transaction: Identified<Tx>
}

export interface TransactionalStorage<
  C extends TransactionalClient<Tx>,
  Tx extends object = TransactionOf<C>,
> extends AsyncLocalStorage<StorageValue<C, Tx>> {}

export type TransactionOf<C extends TransactionalClient> =
  C extends TransactionalClient<infer Tx> ? Tx : never

export type PayloadOf<T extends TransactionalClient<Tx>, Tx extends object> = {
  storage: TransactionalStorage<T, Tx>
  client: T
}
