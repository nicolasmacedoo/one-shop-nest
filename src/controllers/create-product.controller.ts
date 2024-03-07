import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

export const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number(),
})

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
export class CreateProductController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async handle(@Body() body: CreateProductBodySchema) {
    const { name, price, stock } = body

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
