import { EditClientUseCase } from '@/domain/shop/application/use-cases/edit-client'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const editClientBodySchema = z.object({
  name: z.string(),
  document: z.string(),
  email: z.string(),
  phone: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editClientBodySchema)

type EditClientBodySchema = z.infer<typeof editClientBodySchema>

@Controller('/clients/:id')
export class EditClientController {
  constructor(private readonly editClientUseCase: EditClientUseCase) { }

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditClientBodySchema,
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, email, phone, document } = body

    const result = await this.editClientUseCase.execute({
      name,
      email,
      document,
      phone,
      clientId: id,
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
