import { pool } from './database.js'

export const initDB = async () => {
    try {
        await pool.query(createUserTableQuery)
        await pool.query(createGroupTableQuery)
        await pool.query(createGroupMemberTableQuery)
        await pool.query(createGroupMemberRequestTableQuery)
        await pool.query(createGroupMessageTableQuery)
        console.log('Successfully initialized database')
    } catch (error) {
        console.log(error.message)
    }
}

const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100),
        github_id VARCHAR(100) UNIQUE
        email VARCHAR(100) NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        avatar_url TEXT,
        description TEXT,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`

const createGroupTableQuery = `
    CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        owner_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    )
`

const createGroupMemberTableQuery = `
    CREATE TYPE role_type AS ENUM ('owner', 'admin', 'member');
    
    CREATE TABLE IF NOT EXISTS group_members (
        group_id INT,
        member_id INT,
        role role_type NOT NULL,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (group_id, member_id),
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
        FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
    )
`

const createGroupMemberRequestTableQuery = `
    CREATE TABLE IF NOT EXISTS group_member_requests (
        group_id INT,
        user_id INT,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (group_id, user_id),
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`

const createGroupMessageTableQuery = `
    CREATE TABLE IF NOT EXISTS group_messages (
        id SERIAL PRIMARY KEY,
        group_id INT,
        sender_id INT,
        message TEXT NOT NULL,
        image_url TEXT,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    )
`