const rateLimiter = (res, req, next) => {
    console.log('Rate limiter middleware')
    next()
}

export default rateLimiter