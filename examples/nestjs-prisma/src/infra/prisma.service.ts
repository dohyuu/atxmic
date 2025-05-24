import { Injectable, type OnModuleInit } from "@nestjs/common"
import { type Prisma, PrismaClient } from "@prisma/client"
import type { TransactionalClient } from "atxmic"

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, TransactionalClient
{
  async onModuleInit() {
    await this.$connect()
  }

  async _transaction<O>(fn: (tx: Prisma.TransactionClient) => Promise<O>) {
    return this.$transaction(fn)
  }
}
