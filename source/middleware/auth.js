export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.status(401).json({ message: 'You must be logged in to access this resource.' })
}

// TODO: Make the middlware function more generic and admin useable 
export const isOwner = (model) => async (req, res, next) => {
    try {
        // get the item from the database
        const item = await model.findById(req.params.id)
        if (!item) {
            return res.status(404).json({ message: 'Item not found.' })
        }
        // check if the user is the owner of the item
        if (item.user_id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' })
        }
        // if the user is the owner, continue
        next()
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message })
    }
}