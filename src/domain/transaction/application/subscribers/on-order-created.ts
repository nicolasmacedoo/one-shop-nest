import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderCreatedEvent } from '@/domain/shop/enterprise/events/order-created-event'
import { CreateTransactionUseCase } from '../use-case/create-transaction'

export class OnOrderCreated implements EventHandler {
  constructor(private createTransaction: CreateTransactionUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onOrderCreated.bind(this),
      OrderCreatedEvent.name,
    )
  }

  private async onOrderCreated({ order }: OrderCreatedEvent): Promise<void> {
    console.log('Order created', order)

    await this.createTransaction.execute({
      userId: order.userId.toString(),
      clientId: order.clientId.toString(),
      orderId: order.id.toString(),
      value: order.total,
      description: `Transaction refer to order ${order.id.toString()}`,
    })
  }
}
