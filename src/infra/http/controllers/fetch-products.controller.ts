import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchProductsUseCase } from '@/domain/shop/application/use-cases/fetch-products'
import { ProductPresenter } from '../presenters/product-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class FetchProductsController {
  constructor(private readonly fetchProducts: FetchProductsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchProducts.execute({
      page,
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new Error('Unexpected error')
    }

    const { products } = result.value

    return {
      products: products.map(ProductPresenter.toHTTP),
    }
  }
}
