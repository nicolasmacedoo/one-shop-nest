import { Either, right } from '@/core/either'
import { TransactionRepostiory } from '../repositories/transactions-repository'
import { Transaction } from '../../enterprise/entities/transaction'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateTransactionUseCaseRequest {
  userId: string
  clientId: string
  orderId: string
  value: number
  description: string
}

type CreateTransactionUseCaseResponse = Either<
  null,
  {
    transaction: Transaction
  }
>

export class CreateTransactionUseCase {
  constructor(private transactionRepository: TransactionRepostiory) {}

  async execute({
    userId,
    clientId,
    orderId,
    value,
    description,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const transaction = Transaction.create({
      userId: new UniqueEntityID(userId),
      clientId: new UniqueEntityID(clientId),
      orderId: new UniqueEntityID(orderId),
      value,
      description,
      date: new Date(),
    })

    await this.transactionRepository.create(transaction)

    return right({
      transaction,
    })
  }
}
