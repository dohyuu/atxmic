import { prismaAdapter } from "@atxmic/prisma"
import { Injectable, type OnModuleInit } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class PrismaService
  extends prismaAdapter(PrismaClient)
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect()
  }
}
