import express from 'express'
import { login, signup, logout } from '../controllers/authController.js'
import passport from 'passport'
import { isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.get('/logout', logout)
router.get('/github', 
    passport.authenticate('github', { scope: ['user:email'] })
)

router.get('/check', isAuthenticated, (req, res) => {
    res.json({ user: req.user })
})
  
router.get('/github/callback', 
    passport.authenticate('github', { 
        failureRedirect: 'http://localhost:5173/',
        successRedirect: 'http://localhost:5173/dash'
    }),
)

export default router