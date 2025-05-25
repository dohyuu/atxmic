# Atxmic

> Documentation is currently being written.  
  The API may change during development as it is still actively being developed.

**A`tx`mic** is a library that allows atomic management of database transactions.


## Using with Prisma in NestJS

```bash
pnpm add atxmic
pnpm add @atxmic/prisma
pnpm add @atxmic/nestjs
```

```typescript
// examples/nestjs-prisma/src/app.module.ts
import { TransactionModule } from "@atxmic/nestjs"
import { Module } from "@nestjs/common"
import { PrismaService } from "./infra/prisma.service"

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
```

```typescript
// examples/nestjs-prisma/src/posts.controller.ts
import { Transactional } from "@atxmic/nestjs"
import { Body, Controller, Post } from "@nestjs/common"

@Controller("posts")
export class PostsController {
  constructor(
    private readonly postService: PostService,
  ) {}

  @Post()
  @Transactional()
  async create(@Body() body) {
    const author = await this.userService.createUser({
      name: body.name,
      address: body.address,
    })

    const post = await this.postService.createPost(author.id, {
      title: body.title,
      content: body.content,
    })

    return {
      data: post,
    }
  }
}
```

## Roadmap

- [ ] TypeORM support
- [ ] Sequelize support
- [ ] Drizzle support
- [ ] Add Express examples
- [ ] Distributed transaction support 