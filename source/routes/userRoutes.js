import express from 'express'
import userController from '../controllers/userController.js'
import authCheck from '../middleware/authCheck.js'
const router = express.Router()

// Public
router.post('/', userController.createUser)

// Protected
router.use(authCheck)

router.get('/', userController.getAllUsers)

router.route('/:userId')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

export default router