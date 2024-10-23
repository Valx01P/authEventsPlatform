import express from 'express'
import userController from '../controllers/userController.js'
import { isAuthenticated } from '../middleware/auth.js'
const router = express.Router()

router.use(isAuthenticated)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

export default router