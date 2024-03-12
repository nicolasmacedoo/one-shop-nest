import { PaginationParams } from '@/core/repositories/pagination-params'
import { Client } from '../../enterprise/entities/client'

export abstract class ClientsRepository {
  abstract findById(id: string): Promise<Client | null>
  abstract findByDocument(document: string): Promise<Client | null>
  abstract findMany(userId: string, params: PaginationParams): Promise<Client[]>
  abstract save(client: Client): Promise<void>
  abstract create(client: Client): Promise<void>
  abstract delete(client: Client): Promise<void>
}
