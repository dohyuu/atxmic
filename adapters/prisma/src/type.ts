import type { JsPromise, UnwrapTuple } from "@prisma/client/runtime/library"

export interface PrismaClientLike<
  Tx extends Record<string, unknown> = Record<string, unknown>,
> {
  $transaction<P extends PrismaPromiseLike<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: string },
  ): JsPromise<UnwrapTuple<P>>

  $transaction<R>(
    fn: (prisma: Tx) => JsPromise<R>,
    options?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: string
    },
  ): JsPromise<R>
}

export type PrismaTransactionOf<T extends PrismaClientLike> = Parameters<
  Parameters<T["$transaction"]>[0]
>[0]

export declare interface PrismaPromiseLike<T> extends Promise<T> {
  [Symbol.toStringTag]: "PrismaPromise"
}
