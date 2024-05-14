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
    { page, query }: PaginationParams,
  ): Promise<{ clients: Client[]; totalCount: number }> {
    const allClients = this.items.filter(
      (item) => item.userId.toString() === userId,
    )
    const clients = this.items
      .filter((item) => item.userId.toString() === userId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * 10, page * 10)

    if (query)
      return {
        clients: clients.filter((item) => item.name.includes(query)),
        totalCount: allClients.filter((item) => item.name.includes(query))
          .length,
      }

    return {
      clients,
      totalCount: allClients.length,
    }
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
