import authController from '../controllers/authController.js'
const router = express.Router()

// Public

router.route('/login')
    .post(authController.login)

router.refresh('/refresh')
    .post(authController.refresh)

router.logout('/logout')
    .post(authController.logout)


export default router