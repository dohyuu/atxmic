import {
  createTransactionalClient,
  type TransactionalClient,
  transaction,
} from "atxmic"
import type { PrismaClientLike, PrismaTransactionOf } from "./type"
import { isClass } from "./utils/is-class"

export const prismaInstanceAdapter = <
  T extends PrismaClientLike<Tx>,
  Tx extends object = PrismaTransactionOf<T>,
>(
  client: T,
): T & TransactionalClient<Tx> => {
  return createTransactionalClient(client, (fn) => client.$transaction(fn))
}

export interface TransactionalPrismaClient<
  T extends PrismaClientLike<Tx>,
  Tx extends object,
> extends TransactionalClient<Tx> {
  new (...args: any[]): T & TransactionalClient<Tx>
}

export const prismaClassAdapter = <
  T extends new (
    ...args: any[]
  ) => PrismaClientLike<Tx>,
  Tx extends object,
>(
  input: T,
): TransactionalPrismaClient<InstanceType<T>, Tx> => {
  class _TransactionalPrismaClient
    extends input
    implements TransactionalClient<Tx>
  {
    _transaction = this.$transaction
    _atomicTransaction = transaction
  }

  return _TransactionalPrismaClient as unknown as TransactionalPrismaClient<
    InstanceType<T>,
    Tx
  >
}

export function prismaAdapter<
  I extends PrismaClientLike<Tx>,
  Tx extends object,
>(client: I): I & TransactionalClient<Tx>

export function prismaAdapter<
  I extends new (
    ...args: any[]
  ) => PrismaClientLike<Tx>,
  Tx extends object,
>(client: I): TransactionalPrismaClient<InstanceType<I>, Tx>

export function prismaAdapter<
  I extends
    | PrismaClientLike<Tx>
    | (new (
        ...args: any[]
      ) => PrismaClientLike<Tx>),
  Tx extends object,
>(client: I) {
  if (isClass(client)) {
    return prismaClassAdapter(client)
  }

  return prismaInstanceAdapter(client)
}

export type Adapter<T extends object, Tx extends object> = (
  client: T,
) => T & TransactionalClient<Tx>
