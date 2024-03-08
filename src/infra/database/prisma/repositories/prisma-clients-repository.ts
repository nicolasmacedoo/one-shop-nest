import { PaginationParams } from '@/core/repositories/pagination-params'
import { ClientsRepository } from '@/domain/shop/application/repositories/clients-repository'
import { Client } from '@/domain/shop/enterprise/entities/client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
  findById(id: string): Promise<Client | null> {
    throw new Error('Method not implemented.')
  }

  findByDocument(document: string): Promise<Client | null> {
    throw new Error('Method not implemented.')
  }

  findMany(userId: string, params: PaginationParams): Promise<Client[]> {
    throw new Error('Method not implemented.')
  }

  save(client: Client): Promise<void> {
    throw new Error('Method not implemented.')
  }

  create(client: Client): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(document: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
