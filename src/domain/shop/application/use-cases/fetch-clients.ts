import { Either, right } from '@/core/either'
import { ClientsRepository } from '../repositories/clients-repository'
import { Client } from '../../enterprise/entities/client'

interface FetchClientsUseCaseRequest {
  userId: string
  page: number
}

type FetchClientsUseCaseResponse = Either<
  null,
  {
    clients: Client[]
  }
>

export class FetchClientsUseCase {
  constructor(private readonly clientRepository: ClientsRepository) {}

  async execute({
    userId,
    page,
  }: FetchClientsUseCaseRequest): Promise<FetchClientsUseCaseResponse> {
    const clients = await this.clientRepository.findMany(userId, { page })

    return right({
      clients,
    })
  }
}