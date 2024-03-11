import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateProductUseCase } from '@/domain/shop/application/use-cases/create-product'

export const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class CreateProductController {
  constructor(private readonly createProduct: CreateProductUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe)
    body: CreateProductBodySchema,
  ) {
    const { name, price, stock } = body
    const { sub: userId } = user

    await this.createProduct.execute({
      userId,
      name,
      price,
      stock,
    })
  }
}
