import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/shop/enterprise/entities/user'
import { Email } from '@/domain/shop/enterprise/entities/value-objects/email'
import { User as PrismaUser, Prisma } from '@prisma/client'
export class PrismaUserMapper {
  public static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: new Email(raw.email),
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  public static toPersistence(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email.value,
      password: user.password,
    }
  }
}
