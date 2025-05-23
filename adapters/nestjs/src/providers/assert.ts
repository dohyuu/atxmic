import type {
  ClassProvider,
  ExistingProvider,
  FactoryProvider,
  Provider,
  Type,
  ValueProvider,
} from "@nestjs/common"

export function isTypeProvider(provider: Provider): provider is Type<any> {
  return !!(typeof provider === "function" && provider.prototype)
}
export function isClassProvider(provider: Provider): provider is ClassProvider {
  return Boolean((provider as ClassProvider)?.useClass)
}

export function isValueProvider(provider: Provider): provider is ValueProvider {
  const providerValue = (provider as ValueProvider)?.useValue
  return providerValue !== undefined
}

export function isFactoryProvider(
  provider: Provider,
): provider is FactoryProvider {
  return Boolean((provider as FactoryProvider).useFactory)
}

export function isExistingProvider(
  provider: Provider,
): provider is ExistingProvider {
  return Boolean((provider as ExistingProvider).useExisting)
}
