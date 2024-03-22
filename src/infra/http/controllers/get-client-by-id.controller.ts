import { GetClientByIdUseCase } from '@/domain/shop/application/use-cases/get-client-by-id'
import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ClientPresenter } from '../presenters/client-presenter'

@Controller('/clients/:id')
export class GetClientByIdController {
  constructor(private readonly getClientByIdUseCase: GetClientByIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getClientByIdUseCase.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException()
    }

    const { client } = result.value

    return { client: ClientPresenter.toHTTP(client) }
  }
}
