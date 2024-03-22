import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ClientsRepository } from '../repositories/clients-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteClientUseCaseRequest {
  clientId: string
  userId: string
}

type DeleteClientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  void
>

@Injectable()
export class DeleteClientUseCase {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async execute({
    clientId,
    userId,
  }: DeleteClientUseCaseRequest): Promise<DeleteClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    if (userId !== client.userId.toString()) {
      return left(new NotAllowedError())
    }

    await this.clientsRepository.delete(client)

    return right(undefined)
  }
}
