import groupMessageController from '../controllers/groupMessageController.js'
import authCheck from '../middleware/authCheck.js'
const router = express.Router({ mergeParams: true })

// Protected
router.use(authCheck)

router.route('/')
    .get(groupMessageController.getGroupMessages)

router.route('/upload')
    .post(groupMessageController.uploadImage)
    .delete(groupMessageController.deleteImage)

export default router