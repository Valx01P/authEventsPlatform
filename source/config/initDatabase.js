import { pool } from './database.js'

export const initDB = async () => {
    try {
        const createTable = `
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                price DECIMAL(10, 2) NOT NULL,
                meal VARCHAR(100) NOT NULL,
                side VARCHAR(100) NOT NULL,
                drink VARCHAR(100) NOT NULL,
                dessert VARCHAR(100) NOT NULL
            )
        `
        await pool.query(createTable)
        console.log('Table created')
    } catch (error) {
        console.log(error.message)
    }
}

// const createTable = `
//     CREATE TABLE IF NOT EXISTS orders (
//         id SERIAL PRIMARY KEY,
//         price DECIMAL(10, 2) NOT NULL,
//         meal VARCHAR(100) NOT NULL,
//         side VARCHAR(100) NOT NULL,
//         drink VARCHAR(100) NOT NULL,
//         dessert VARCHAR(100) NOT NULL
//     )
// `

initDB()


