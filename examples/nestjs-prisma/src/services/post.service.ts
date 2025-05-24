import { Transactional } from "@atxmic/nestjs"
import { Injectable } from "@nestjs/common"
import type { PrismaService } from "../infra/prisma.service"
import type { UserService } from "./user.service"

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createPost(authorId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...dto,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    })
  }

  @Transactional()
  async updatePost(id: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
      },
    })

    return post
  }
}

export type CreatePostDto = {
  title: string
  content: string
}

export type UpdatePostDto = {
  title?: string
  content?: string
}
