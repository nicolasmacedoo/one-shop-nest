import { UsersRepository } from '@/domain/shop/application/repositories/users-repository'
import { User } from '@/domain/shop/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email.toString() === email) || null
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }
}
