import groupController from '../controllers/groupController.js'
import { isAuthenticated } from '../middleware/auth.js'
const router = express.Router()

// Protected
router.use(isAuthenticated)

router.route('/')
    .get(groupController.getAllGroups)
    .post(groupController.createGroup)

router.route('/:id')
    .get(groupController.getGroup)
    .patch(groupController.updateGroup)
    .delete(groupController.deleteGroup)

export default router