import { CreateOrderUseCase } from '@/domain/shop/application/use-cases/create-order'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createOrderBodySchema = z.object({
  clientId: z.string().uuid(),
  orderItems: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private readonly createOrder: CreateOrderUseCase) { }

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateOrderBodySchema,
  ) {
    const { clientId, orderItems } = body

    const { sub: userId } = user

    const result = await this.createOrder.execute({
      clientId,
      userId,
      items: orderItems,
    })

    console.log(result)

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
