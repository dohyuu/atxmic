import { Inject } from "@nestjs/common"
import {
  Propagation,
  type TransactionalClient,
  TransactionStorage,
} from "atxmic"
import { CLIENT_KEY } from "./constants"

export function Transactional(
  propagation: keyof typeof Propagation = Propagation.Flat,
): MethodDecorator {
  const client = Inject(CLIENT_KEY)
  const storage = Inject(TransactionStorage)

  return (target: NonNullable<unknown>, _, descriptor: PropertyDescriptor) => {
    client(target, "client")
    storage(target, "storage")

    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<unknown>

    descriptor.value = async function atomically(...args: unknown[]) {
      const { client, storage } = this as {
        client: TransactionalClient
        storage: TransactionStorage<TransactionalClient>
      }

      return client._atomicTransaction(
        {
          client,
          storage,
        },
        () => originalMethod.apply(this, args),
      )
    }

    copyMethodMetadata(originalMethod, descriptor.value)
  }
}

export function copyMethodMetadata(from: any, to: any) {
  const metadataKeys = Reflect.getMetadataKeys(from)
  metadataKeys.map((key) => {
    const value = Reflect.getMetadata(key, from)
    Reflect.defineMetadata(key, value, to)
  })
}
