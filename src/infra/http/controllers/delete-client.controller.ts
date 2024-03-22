import { DeleteClientUseCase } from '@/domain/shop/application/use-cases/delete-client'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/shop/application/use-cases/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

@Controller('/clients/:id')
export class DeleteClientController {
  constructor(private readonly deleteClient: DeleteClientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') clientId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteClient.execute({
      userId,
      clientId,
    })

    if (result.isLeft()) {
      const err = result.value

      switch (true) {
        case err instanceof NotAllowedError:
          throw new ForbiddenException(err.message)
        case err instanceof ResourceNotFoundError:
          throw new NotFoundException(err.message)
        default:
          throw new BadRequestException(err)
      }
    }
  }
}
