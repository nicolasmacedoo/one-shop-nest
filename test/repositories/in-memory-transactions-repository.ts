import { TransactionRepostiory } from '@/domain/transaction/application/repositories/transactions-repository'
import { Transaction } from '@/domain/transaction/enterprise/entities/transaction'

export class InMemoryTransactionsRepository implements TransactionRepostiory {
  public items: Transaction[] = []

  async create(transaction: Transaction): Promise<void> {
    this.items.push(transaction)
  }
}
