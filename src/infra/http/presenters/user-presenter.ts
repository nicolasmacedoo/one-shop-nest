import { User } from '@/domain/shop/enterprise/entities/user'

export class UserPresenter {
  public static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
