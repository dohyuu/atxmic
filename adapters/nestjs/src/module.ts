import { type DynamicModule, Module } from "@nestjs/common"
import { createProviders } from "./providers"
import { getInjectionTokenFromProvider } from "./providers/utils"
import type { RegisterOptions } from "./types"

@Module({})
export class TransactionModule {
  static register(options: RegisterOptions): DynamicModule {
    const { client } = options

    const providers = createProviders(client)

    return {
      module: TransactionModule,
      providers,
      exports: providers
        .map(getInjectionTokenFromProvider)
        .filter((p) => p !== undefined),
    }
  }
}
