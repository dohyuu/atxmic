import { createTransactionalClient, type TransactionalClient } from "atxmic"
import type { PrismaClientLike, PrismaTransactionOf } from "./type"

export const prismaAdapter = <
  T extends PrismaClientLike<Tx>,
  Tx extends Record<string, unknown> = PrismaTransactionOf<T>,
>(
  client: T,
): TransactionalClient<Tx> => {
  return createTransactionalClient(client, (fn) => client.$transaction(fn))
}
