import { Either, right } from '@/core/either'
import { ClientsRepository } from '../repositories/clients-repository'
import { Client } from '../../enterprise/entities/client'
import { Injectable } from '@nestjs/common'

interface FetchClientsUseCaseRequest {
  userId: string
  page: number
  query?: string
}

type FetchClientsUseCaseResponse = Either<
  null,
  {
    clients: Client[]
  }
>

@Injectable()
export class FetchClientsUseCase {
  constructor(private readonly clientRepository: ClientsRepository) {}

  async execute({
    userId,
    page,
    query,
  }: FetchClientsUseCaseRequest): Promise<FetchClientsUseCaseResponse> {
    const clients = await this.clientRepository.findMany(userId, {
      page,
      query,
    })

    return right({
      clients,
    })
  }
}
