import { Client, ClientProps } from '@/domain/shop/enterprise/entities/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaClientMapper } from '@/infra/database/prisma/mappers/prisma-client-mapper'

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

@Injectable()
export class ClientFactory {
  constructor(private readonly prisa: PrismaService) {}

  async makePrismaClient(data: Partial<ClientProps> = {}): Promise<Client> {
    const client = makeClient(data)

    await this.prisa.client.create({
      data: PrismaClientMapper.toPersistence(client),
    })

    return client
  }
}
