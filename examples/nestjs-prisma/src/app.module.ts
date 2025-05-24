import { TransactionModule } from "@atxmic/nestjs"
import { Module } from "@nestjs/common"
import { PostsController } from "./contollers/posts.controller"
import { PrismaModule } from "./infra/prisma.module"
import { PrismaService } from "./infra/prisma.service"
import { PostService } from "./services/post.service"

@Module({
  imports: [
    PrismaModule,
    TransactionModule.register({
      client: PrismaService,
    }),
  ],
  controllers: [PostsController],
  providers: [PostService],
})
export class AppModule {}
