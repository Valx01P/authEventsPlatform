import express from 'express'
import userController from '../controllers/userController.js'
import authCheck from '../middleware/auth.js'
const router = express.Router()

router.use(authCheck)

router.route('/:userId')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

export default router