import { Client, ClientProps } from '@/domain/shop/enterprise/entities/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityID,
): Client {
  return Client.create(
    {
      userId: new UniqueEntityID(),
      name: faker.person.fullName(),
      document: faker.string.numeric({ length: 11, allowLeadingZeros: true }),
      phone: faker.helpers.fromRegExp(/\(\d{2}\) \d{5}-\d{4}/),
      // phone: faker.helpers.fromRegExp(/\(\d{2}\) \d{4,5}-\d{4}/),
      email: faker.internet.email(),
      ...override,
    },
    id,
  )
}
