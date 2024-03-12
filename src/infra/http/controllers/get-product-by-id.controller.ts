import { GetProductByIdUseCase } from '@/domain/shop/application/use-cases/get-product-by-id'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ProductPresenter } from '../presenters/product-presenter'

@Controller('/products/:id')
export class GetProductByIdController {
  constructor(private readonly getProductById: GetProductByIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getProductById.execute({ id })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { product } = result.value

    return { product: ProductPresenter.toHTTP(product) }
  }
}
