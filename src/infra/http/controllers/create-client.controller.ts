import { CreateClientUseCase } from '@/domain/shop/application/use-cases/create-client'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceAlreadyExistsError } from '@/domain/shop/application/use-cases/errors/resource-already-exists-error'

const createClientBodySchema = z.object({
  name: z.string(),
  document: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createClientBodySchema)

type CreateClientBodySchema = z.infer<typeof createClientBodySchema>

@Controller('/clients')
export class CreateClientController {
  constructor(private readonly createClient: CreateClientUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateClientBodySchema,
  ) {
    const { name, document, email, phone } = body
    const { sub: userId } = user

    const result = await this.createClient.execute({
      userId,
      name,
      document,
      email,
      phone,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
