import { EditProductUseCase } from '@/domain/shop/application/use-cases/edit-product'
import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const editProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(editProductBodySchema)

type EditProductBodySchema = z.infer<typeof editProductBodySchema>

@Controller('products/:id')
export class EditProductController {
  constructor(private readonly editProductUseCase: EditProductUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditProductBodySchema,
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, price, stock } = body

    const result = await this.editProductUseCase.execute({
      name,
      price,
      stock,
      productId: id,
      userId: user.sub,
    })

    if (result.isLeft()) {
      return result.value
    }
  }
}
