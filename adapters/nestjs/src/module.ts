import { type DynamicModule, Module } from "@nestjs/common"
import type { RegisterOptions } from "./types"

@Module({})
export class TransactionModule {
  static register(options: RegisterOptions): DynamicModule {
    return {
      module: TransactionModule,
      providers: [options.client],
      exports: [options.client],
    }
  }
}
