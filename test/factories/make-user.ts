import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/shop/enterprise/entities/user'
import { Email } from '@/domain/shop/enterprise/entities/value-objects/email'
import { faker } from '@faker-js/faker/locale/pt_BR'

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
