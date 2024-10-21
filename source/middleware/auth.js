export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.status(401).json({ message: 'You must be logged in to access this resource.' })
  }
  
export const isOwner = (model) => async (req, res, next) => {
    try {
        const item = await model.findById(req.params.id)
        if (!item) {
            return res.status(404).json({ message: 'Item not found.' })
        }
        if (item.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' })
        }
        next()
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message })
    }
}