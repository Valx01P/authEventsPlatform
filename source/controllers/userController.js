import User from '../models/userModel.js'
import bcrypt from 'bcrypt'

const userController = {
    getUser: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
            let id = req.params.id
            let github_id = req.body.github_id
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10)
            }
            const updatedUser = await user.update(id, github_id, req.body)
            res.status(200).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },
    // remember to add logout functionality after deleting self
    deleteUser: async (req, res, next) => {
        try {
            await User.delete(req.params.id)
            res.status(204).end()
        } catch (error) {
            next(error)
        }
    }
}

export default userController