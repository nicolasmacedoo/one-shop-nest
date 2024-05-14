import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchProductsUseCase } from '@/domain/shop/application/use-cases/fetch-products'
import { ProductPresenter } from '../presenters/product-presenter'

const queryParamSchema = z.string().optional()

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type QueryParamSchema = z.infer<typeof queryParamSchema>

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/products')
export class FetchProductsController {
  constructor(private readonly fetchProducts: FetchProductsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', pageValidationPipe) page: PageQueryParamSchema,
    @Query('query', queryValidationPipe) query: QueryParamSchema,
  ) {
    const result = await this.fetchProducts.execute({
      query,
      page,
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { products } = result.value

    return {
      products: products.map(ProductPresenter.toHTTP),
    }
  }
}
