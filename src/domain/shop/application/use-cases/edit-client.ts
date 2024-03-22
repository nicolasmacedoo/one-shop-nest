import { ClientsRepository } from '../repositories/clients-repository'
import { Client } from '@/domain/shop/enterprise/entities/client'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shop/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface EditClientUseCaseRequest {
  clientId: string
  userId: string
  name: string
  document: string
  email: string
  phone: string
}

type EditClientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    client: Client
  }
>

@Injectable()
export class EditClientUseCase {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async execute({
    clientId,
    userId,
    name,
    document,
    email,
    phone,
  }: EditClientUseCaseRequest): Promise<EditClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    if (userId !== client.userId.toString()) {
      return left(new NotAllowedError())
    }

    client.name = name
    client.document = document
    client.email = email
    client.phone = phone

    await this.clientsRepository.save(client)

    return right({
      client,
    })
  }
}
