import { isAuthenticated } from '../middleware/auth.js'
import { upload } from '../config/s3Config.js'
import imageController from '../controllers/imageController.js'
const router = express.Router({ mergeParams: true })

router.use(isAuthenticated)

// get all images from a group
router.get('/images', (req, res) => {

})

// get all images from a member of a group
router.get('/members/:id/images', (req, res) => {
  
})

// upload image to message in group
router.post('/messages/:id/images', upload.single('image'), (req, res) => {

})

// delete image from message in group
router.delete('/messages/:id/images', (req, res) => {

})

export default router