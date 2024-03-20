import { FetchClientsUseCase } from '@/domain/shop/application/use-cases/fetch-clients'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ClientPresenter } from '../presenters/client-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/clients')
export class FetchClientsController {
  constructor(private readonly fetchClients: FetchClientsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchClients.execute({
      page,
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { clients } = result.value

    return {
      clients: clients.map(ClientPresenter.toHTTP),
    }
  }
}
