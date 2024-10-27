
const User = {
    findById: async (id) => {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
        return result.rows[0]
    },

    findByUsername: async (username) => {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
        return result.rows[0]
    },

    create: async (username, password, github_id=null, email, display_name, avatar_url=null, description=null) => {
        const result = await pool.query(
            'INSERT INTO users (username, password, github_id, email, display_name, avatar_url, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [username, password, github_id, email, display_name, avatar_url, description]
        )
        return result.rows[0]
    },

    update: async (id=null, github_id=null, data) => {
        if (!id && !github_id) {
            throw new Error('Must provide either id or github_id')
        }
        const { username, password, email, display_name, avatar_url, description } = data
        const result = await pool.query(
            'UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password), email = COALESCE($3, email), display_name = COALESCE($4, display_name), avatar_url = COALESCE($5, avatar_url), description = COALESCE($6, description) WHERE id = $7 OR github_id = $8 RETURNING *',
            [username, password, email, display_name, avatar_url, description, id, github_id]
        )
        return result.rows[0]
    },

    delete: async (id=null, github_id=null) => {
        if (!id && !github_id) {
            throw new Error('Must provide either id or github_id')
        }
        const result = await pool.query('DELETE FROM users WHERE id = $1 OR github_id = $2 RETURNING *', [id, github_id])
        return result.rows[0]
    }
}

export default User