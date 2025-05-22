import type { AsyncLocalStorage } from "node:async_hooks"
import type { IsolationLevel } from "./isolation"

export type TransactionCallback<
  Tx extends Record<string, unknown> = Record<string, unknown>,
  Output = unknown,
> = (tx: Tx) => Promise<Output>

export type TransactionRunner<
  Tx extends Record<string, unknown> = Record<string, unknown>,
  Output = unknown,
> = <O = Output>(
  fn: TransactionCallback<Tx, O>,
  options?: {
    isolationLevel?: IsolationLevel
  },
) => Promise<O>

export interface TransactionalClient<
  Tx extends Record<string, unknown> = Record<string, unknown>,
> {
  _transaction: TransactionRunner<Tx>
}

export type Identified<T extends Record<string, unknown>> = T & {
  id: string
}

export type StorageValue<
  C extends TransactionalClient<Tx>,
  Tx extends Record<string, unknown> = TransactionOf<C>,
> = {
  transaction: Identified<Tx>
}

export interface TransactionalStorage<
  C extends TransactionalClient<Tx>,
  Tx extends Record<string, unknown> = TransactionOf<C>,
> extends AsyncLocalStorage<StorageValue<C, Tx>> {}

export type TransactionOf<C extends TransactionalClient> =
  C extends TransactionalClient<infer Tx> ? Tx : never

export type PayloadOf<
  T extends TransactionalClient<Tx>,
  Tx extends Record<string, unknown>,
> = {
  storage: TransactionalStorage<T, Tx>
  client: T
}
