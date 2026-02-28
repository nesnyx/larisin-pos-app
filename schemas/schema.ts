import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'products',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'price', type: 'number' },
                { name: 'category', type: 'string' },
                { name: 'stock', type: 'number' },
                { name: 'userId', type: 'string' },
                { name: 'updatedAt', type: 'number' },
                { name: 'createdAt', type: 'number' },
                { name: 'isSynced', type: 'boolean' },
            ]
        }),
        tableSchema({
            name: 'transactions',
            columns: [
                { name: 'totalPrice', type: 'number' },
                { name: 'charge', type: 'number' },
                { name: 'userId', type: 'string' },
                { name: 'amount', type: 'number' },
                { name: 'createdAt', type: 'number' },
                { name: 'status', type: 'string' },
                { name: 'customerName', type: 'string' },
                { name: 'isSynced', type: 'boolean' },
            ]
        }),
        tableSchema({
            name: 'transaction_items',
            columns: [
                { name: 'transactionId', type: 'string', isIndexed: true },
                { name: 'productId', type: 'string', isIndexed: true },
                { name: 'productName', type: 'string' },
                { name: 'quantity', type: 'number' },
                { name: 'price', type: 'number' },
                { name: 'isSynced', type: 'boolean' },
            ]
        }),
    ]
})

