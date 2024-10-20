import groupController from '../controllers/groupController.js'
import authCheck from '../middleware/auth.js'
const router = express.Router()

// Protected
router.use(authCheck)

router.route('/')
    .get(groupController.getAllGroups)
    .post(groupController.createGroup)

router.route('/:groupId')
    .get(groupController.getGroup)
    .patch(groupController.updateGroup)
    .delete(groupController.deleteGroup)

export default router