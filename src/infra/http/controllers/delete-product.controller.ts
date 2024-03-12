import { DeleteProductUseCase } from '@/domain/shop/application/use-cases/delete-product'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/products/:id')
export class DeleteProductController {
  constructor(private readonly deleteProduct: DeleteProductUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') productId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.deleteProduct.execute({
      productId,
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
