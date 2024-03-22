import { Client as PrismaClient, Prisma } from '@prisma/client'
import { Client } from '@/domain/shop/enterprise/entities/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaClientMapper {
  public static toDomain(raw: PrismaClient): Client {
    return Client.create(
      {
        userId: new UniqueEntityID(raw.userId),
        name: raw.name,
        document: raw.document,
        email: raw.email,
        phone: raw.phone,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  public static toPersistence(
    client: Client,
  ): Prisma.ClientUncheckedCreateInput {
    return {
      id: client.id.toString(),
      userId: client.userId.toString(),
      name: client.name,
      document: client.document,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}
