import { Either, left, right } from '@/core/either'
import { ClientsRepository } from '../repositories/clients-repository'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'
import { Client } from '../../enterprise/entities/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface CreateClientUseCaseRequest {
  userId: string
  name: string
  document: string
  email?: string
  phone?: string
}

type CreateClientUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { client: Client }
>

@Injectable()
export class CreateClientUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    userId,
    name,
    email,
    document,
    phone,
  }: CreateClientUseCaseRequest): Promise<CreateClientUseCaseResponse> {
    const clientAlreadyExists =
      await this.clientsRepository.findByDocument(document)

    if (clientAlreadyExists) {
      return left(
        new ResourceAlreadyExistsError(
          `Client with document ${document} already exists`,
        ),
      )
    }

    const client = Client.create({
      userId: new UniqueEntityID(userId),
      name,
      document,
      email,
      phone,
    })

    await this.clientsRepository.create(client)

    return right({
      client,
    })
  }
}
