import { PaginationParams } from '@/core/repositories/pagination-params'
import { Client } from '../../enterprise/entities/client'

export interface ClientsRepository {
  findById(id: string): Promise<Client | null>
  findByDocument(document: string): Promise<Client | null>
  findMany(userId: string, params: PaginationParams): Promise<Client[]>
  save(client: Client): Promise<void>
  create(client: Client): Promise<void>
  delete(document: string): Promise<void>
}
