import { GetUserProfileUseCase } from '@/domain/shop/application/use-cases/get-user-profile'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { UserPresenter } from '../presenters/user-presenter'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/users/profile')
export class GetUserProfileController {
  constructor(private readonly getUserProfile: GetUserProfileUseCase) { }

  @Get()
  async handle(@CurrentUser() userSession: UserPayload) {
    const { sub: id } = userSession
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
