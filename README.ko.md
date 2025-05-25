# Atxmic

> 문서는 현재 작성중입니다.
> 아직 활발히 개발 중이므로 API가 도중에 변경될 수 있습니다.

**Atxmic**은 데이터베이스 트랜잭션을 원자적으로 관리할 수 있는 라이브러리입니다.


## Nestjs에서 Prisma와 함께 사용

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

## Loadmap

- [ ] Typeorm 지원
- [ ] Sequelize 지원
- [ ] Drizzle 지원
- [ ] Express 예제 추가
- [ ] 분산 트랜잭션 지원