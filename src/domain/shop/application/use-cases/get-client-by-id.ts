import { Either, left, right } from '@/core/either'
import { ClientsRepository } from '../repositories/clients-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Client } from '../../enterprise/entities/client'
import { Injectable } from '@nestjs/common'

interface GetClientByIdUseCaseRequest {
  id: string
}

type GetOrderByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    client: Client
  }
>
@Injectable()
export class GetClientByIdUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    id,
  }: GetClientByIdUseCaseRequest): Promise<GetOrderByIdUseCaseResponse> {
    const client = await this.clientsRepository.findById(id)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    return right({
      client,
    })
  }
}
