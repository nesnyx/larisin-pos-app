// database.js
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Product, Transaction } from './models';
import schema from './schema';

const adapter = new SQLiteAdapter({
    schema,
    jsi: true,
    onSetUpError: error => {
        // Tangani jika database gagal dibuat (misal storage penuh)
    }
})

export const database = new Database({
    adapter,
    modelClasses: [Product, Transaction], // Daftarkan class modelmu di sini
})