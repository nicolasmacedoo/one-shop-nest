import { GetUserProfileUseCase } from '@/domain/shop/application/use-cases/get-user-profile'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { UserPresenter } from '../presenters/user-presenter'

@Controller('/users/:id/profile')
export class GetUserProfileController {
  constructor(private readonly getUserProfile: GetUserProfileUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getUserProfile.execute({ id })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { user } = result.value

    return {
      user: UserPresenter.toHTTP(user),
    }
  }
}
