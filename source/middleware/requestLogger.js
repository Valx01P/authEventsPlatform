const requestLogger = (res, req, next) => {
    console.log(req.method)
    console.log(req.body)
    next()
}

export default requestLogger