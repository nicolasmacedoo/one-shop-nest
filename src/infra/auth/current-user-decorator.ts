import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest()

    return request.user
  },
)
