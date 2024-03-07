import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

export const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number(),
})

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class CreateProductController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('/create')
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateProductBodySchema,
  ) {
    const { name, price, stock } = body

    console.log(user)

    // await this.prisma.product.create({
    //   data: {
    //     name,
    //     price,
    //     stock,
    //   },
    // })

    return {
      name,
      price,
      stock,
    }
  }
}
