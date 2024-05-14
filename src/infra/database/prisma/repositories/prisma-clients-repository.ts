import { PaginationParams } from '@/core/repositories/pagination-params'
import { ClientsRepository } from '@/domain/shop/application/repositories/clients-repository'
import { Client } from '@/domain/shop/enterprise/entities/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaClientMapper } from '../mappers/prisma-client-mapper'

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        id,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async findByDocument(document: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        document,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async findMany(
    userId: string,
    { page, query }: PaginationParams,
  ): Promise<{ clients: Client[]; totalCount: number }> {
    const clients = await this.prisma.client.findMany({
      where: {
        userId,
        AND: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    const totalCount = await this.prisma.client.count({
      where: {
        userId,
        AND: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
    })

    return {
      clients: clients.map(PrismaClientMapper.toDomain),
      totalCount,
    }
  }

  async save(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPersistence(client)

    await this.prisma.client.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPersistence(client)

    await this.prisma.client.create({
      data,
    })
  }

  async delete(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPersistence(client)

    await this.prisma.client.delete({
      where: {
        id: data.id,
      },
    })
  }
}
