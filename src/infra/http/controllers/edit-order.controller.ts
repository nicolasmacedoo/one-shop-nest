import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditOrderUseCase } from '@/domain/shop/application/use-cases/edit-order'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const editOrderBodySchema = z.object({
  clientId: z.string().uuid(),
  orderItems: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
    }),
  ),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

type EditOrderSchema = z.infer<typeof editOrderBodySchema>

@Controller('/orders/:id')
export class EditOrderController {
  constructor(private readonly editOrderUseCase: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderSchema,
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { clientId, orderItems } = body

    console.log('ID', id)
    console.log('BODY', body)

    const result = await this.editOrderUseCase.execute({
      clientId,
      orderId: id,
      items: orderItems,
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    console.log('CURRENT ITEMS', result.value.order.items.getItems())
    console.log('REMOVED ITEMS', result.value.order.items.getRemovedItems())
  }
}
