import { Transaction } from '../../enterprise/entities/transaction'

export interface TransactionRepostiory {
  create(transaction: Transaction): Promise<void>
}
