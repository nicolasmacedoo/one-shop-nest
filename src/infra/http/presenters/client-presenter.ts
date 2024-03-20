import { Client } from '@/domain/shop/enterprise/entities/client'

export class ClientPresenter {
  public static toHTTP(client: Client) {
    return {
      id: client.id.toString(),
      name: client.name,
      document: client.document,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}
