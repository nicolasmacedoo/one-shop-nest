import { PaginationParams } from '@/core/repositories/pagination-params'
import { ClientsRepository } from '@/domain/shop/application/repositories/clients-repository'
import { Client } from '@/domain/shop/enterprise/entities/client'

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  async findById(id: string): Promise<Client | null> {
    const client = this.items.find((item) => item.id.toString() === id)

    if (!client) {
      return null
    }

    return client
  }

  async findByDocument(document: string): Promise<Client | null> {
    const client = this.items.find((item) => item.document === document)

    if (!client) {
      return null
    }

    return client
  }

  async findMany(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Client[]> {
    const clients = this.items
      .filter((item) => item.userId.toString() === userId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * 20, page * 20)

    return clients
  }

  async save(client: Client): Promise<void> {
    const index = this.items.findIndex((item) => item.id === client.id)

    this.items[index] = client
  }

  async create(client: Client): Promise<void> {
    this.items.push(client)
  }

  async delete(client: Client): Promise<void> {
    const index = this.items.findIndex((item) => item.id === client.id)

    this.items.splice(index, 1)
  }
}
