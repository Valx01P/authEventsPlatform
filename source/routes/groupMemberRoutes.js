import groupMemberController from '../controllers/groupMemberController.js'
import { isAuthenticated } from '../middleware/auth.js'
const router = express.Router({ mergeParams: true })

// Protected
router.use(isAuthenticated)

router.route('/')
    .get(groupMemberController.getAllGroupMembers)
    .post(groupMemberController.createGroupMember)

router.route('/join')
    .post(groupMemberController.joinGroupRequest)

router.route('/:id')
    .get(groupMemberController.getGroupMember)
    .patch(groupMemberController.updateGroupMember)

router.route('/:id/roles')
    .patch(groupMemberController.updateRoles)

router.route('/:id/leave')
    .post(groupMemberController.leaveGroup)


export default router