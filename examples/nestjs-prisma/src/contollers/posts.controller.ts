import { Transactional } from "@atxmic/nestjs"
import { Body, Controller, Param, Post, Put } from "@nestjs/common"
import type {
  CreatePostDto,
  PostService,
  UpdatePostDto,
} from "../services/post.service"
import type { CreateUserDto, UserService } from "../services/user.service"

@Controller("posts")
export class PostsController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @Transactional()
  async create(@Body() body: CreatePostDto & CreateUserDto) {
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

  @Put(":id")
  async update(
    @Param() params: {
      id: string
    },
    @Body() body: UpdatePostDto,
  ) {
    const post = await this.postService.method_scoped_transaction(
      params.id,
      body,
    )

    return {
      data: post,
    }
  }
}
