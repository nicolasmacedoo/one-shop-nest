import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { FetchOrdersUseCase } from '@/domain/shop/application/use-cases/fetch-recent-orders'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { OrderWithClientPresenter } from '../presenters/order-with-client-presenter'

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

@Controller('/orders')
export class FetchOrdersController {
  constructor(private readonly fetchOrders: FetchOrdersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', pageValidationPipe) page: PageQueryParamSchema,
    @Query('query', queryValidationPipe) query: QueryParamSchema,
  ) {
    const result = await this.fetchOrders.execute({
      userId: user.sub,
      page,
      query,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders, totalCount } = result.value

    return {
      orders: orders.map(OrderWithClientPresenter.toHTTP),
      totalCount,
    }
  }
}
