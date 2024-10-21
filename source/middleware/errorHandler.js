import multer from 'multer'

const errorHandler = (error, req, res, next) => {
    console.error('Error details:', error)

    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size is too large. Max limit is 5MB' })
        }
        return res.status(400).json({ message: `Multer error: ${error.message}` })
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message })
    }

    // Check for specific error types
    if (error.code === 'ENOENT') {
        return res.status(500).json({ message: 'File not found' })
    }

    if (error.code === 'ECONNREFUSED') {
        return res.status(500).json({ message: 'Database connection failed' })
    }

    // For development, you might want to send the full error details
    if (process.env.NODE_ENV !== 'production') {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
            stack: error.stack
        })
    }

    res.status(500).json({ message: 'Something went wrong!' })
}

export default errorHandler