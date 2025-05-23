import type { Provider } from "@nestjs/common"
import {
  isClassProvider,
  isExistingProvider,
  isFactoryProvider,
  isTypeProvider,
  isValueProvider,
} from "./assert"
import { createClassProvider } from "./class"
import { createExistingProvider } from "./existing"
import { createFactoryProvider } from "./factory"
import { createTypeProvider } from "./type"
import { createValueProvider } from "./value"

export function createProviders<T>(client: Provider<T>): Provider<T>[] {
  switch (true) {
    case isTypeProvider(client):
      return createTypeProvider(client)
    case isValueProvider(client):
      return createValueProvider(client)
    case isFactoryProvider(client):
      return createFactoryProvider(client)
    case isClassProvider(client):
      return createClassProvider(client)
    case isExistingProvider(client):
      return createExistingProvider(client)
    default:
      client satisfies never
      return []
  }
}
