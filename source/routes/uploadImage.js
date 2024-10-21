const router = express.Router()
import authCheck from '../middleware/auth.js'
import { upload } from '../config/s3Config.js'

router.use(authCheck)

router.post('/', upload.single('image'), (req, res) => {
  res.status(201).json("bruh")
})
    
router.delete('/:imageId', (req, res) => {
  res.status(201).json("bruh")
})

export default router

