import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

export const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller()
@UseGuards(JwtAuthGuard)
export class CreateProductController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('/create')
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe)
    body: CreateProductBodySchema,
  ) {
    const { name, price, stock } = body
    const { sub: userId } = user

    await this.prisma.product.create({
      data: {
        name,
        price,
        stock,
        userId,
      },
    })
  }
}
