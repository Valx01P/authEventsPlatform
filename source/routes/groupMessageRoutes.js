import groupMessageController from '../controllers/groupMessageController.js'
import { isAuthenticated } from '../middleware/auth.js'
const router = express.Router({ mergeParams: true })

// Protected
router.use(isAuthenticated)

router.route('/')
    .get(groupMessageController.getGroupMessages)

export default router