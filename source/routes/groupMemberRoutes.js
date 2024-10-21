import groupMemberController from '../controllers/groupMemberController.js'
import authCheck from '../middleware/auth.js'
const router = express.Router({ mergeParams: true })

// Protected
router.use(authCheck)

router.route('/')
    .get(groupMemberController.getAllGroupMembers)
    .post(groupMemberController.createGroupMember)

router.route('/join')
    .post(groupMemberController.joinGroupRequest)

router.route('/:groupMemberId')
    .get(groupMemberController.getGroupMember)
    .patch(groupMemberController.updateGroupMember)

router.route('/:groupMemberId/roles')
    .patch(groupMemberController.updateRoles)

router.route('/:groupMemberId/leave')
    .post(groupMemberController.leaveGroup)


export default router