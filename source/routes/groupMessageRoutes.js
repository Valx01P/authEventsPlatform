import groupMessageController from '../controllers/groupMessageController.js'
import authCheck from '../middleware/auth.js'
const router = express.Router({ mergeParams: true })

// Protected
router.use(authCheck)

router.route('/')
    .get(groupMessageController.getGroupMessages)

export default router