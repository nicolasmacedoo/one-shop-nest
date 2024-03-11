import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/shop/enterprise/entities/user'
import { Email } from '@/domain/shop/enterprise/entities/value-objects/email'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { Injectable } from '@nestjs/common'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
): User {
  return User.create(
    {
      name: faker.person.fullName(),
      email: new Email(faker.internet.email()),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class UserFactory {
  constructor(private readonly prisa: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisa.user.create({
      data: PrismaUserMapper.toPersistence(user),
    })

    return user
  }
}
