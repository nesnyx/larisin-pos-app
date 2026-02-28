// model/models.ts
import { Model, Query, Relation } from '@nozbe/watermelondb'
import { children, date, field, readonly, relation } from '@nozbe/watermelondb/decorators'

export class Product extends Model {
    static table = 'products'

    @field('name') name!: string
    @field('price') price!: number
    @field('stock') stock!: number
    @readonly @date('updated_at') updatedAt!: number
}

export class Transaction extends Model {
    static table = 'transactions'

    @field('total_price') totalPrice!: number
    @field('payment_method') paymentMethod!: string
    @readonly @date('created_at') createdAt!: number

    // Perhatikan penulisan Query untuk children
    @children('transaction_items') items!: Query<TransactionItem>
}

export class TransactionItem extends Model {
    static table = 'transaction_items'

    @field('qty') qty!: number
    @field('subtotal') subtotal!: number

    // Gunakan tipe Relation dari WatermelonDB
    @relation('transactions', 'transaction_id') transaction!: Relation<Transaction>
    @relation('products', 'product_id') product!: Relation<Product>
}