import { transaction } from "./transaction"
import type { TransactionalClient, TransactionRunner } from "./types"

export const createTransactionalClient = <
  Client,
  Tx extends Record<string, unknown>,
>(
  client: Client,
  transactionHandler: TransactionRunner<Tx>,
): Client & TransactionalClient<Tx> => {
  return {
    ...client,
    _transaction: transactionHandler,
    _atomicTransaction: transaction,
  }
}
