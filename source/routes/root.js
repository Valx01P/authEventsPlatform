import express from 'express'
import path from 'path'
const router = express.Router()

// Public
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router