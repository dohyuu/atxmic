import { Transactional } from "@atxmic/nestjs"
import { Injectable } from "@nestjs/common"
import type { PrismaService } from "../infra/prisma.service"

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
    })
  }

  @Transactional()
  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    })
  }
}

export type CreateUserDto = {
  name: string
  address?: string | null
}

export type UpdateUserDto = {
  name?: string
  address?: string | null
}
