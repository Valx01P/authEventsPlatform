import express from 'express'
import os from 'os'
import cluster from 'cluster'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import errorHandler from './middlewares/errorHandler'
import requestLogger from './middlewares/requestLogger'
import validateJWT from './middlewares/validateJWT'
import { createServer } from 'http'
import { socketIo } from 'socket.io'
import setUpSocketHandlers from './socketHandlers'
import authMiddleware from './middleware/authCheck'
import userRoutes from './routes/userRoutes'
import groupMessageRoutes from './routes/groupMessageRoutes'
import groupRoutes from './routes/groupRoutes'
import groupMemberRoutes from './routes/groupMemberRoutes'
import initDatabase from './initDatabase'
import authRoutes from './routes/authRoutes'
import rateLimiter from './middleware/rateLimiter'
import root from './routes/root'
import csurf from 'csurf'

if (cluster.isPrimary) {
    const numCPUSs = os.cpus().length
    for (let i = 0; i < numCPUSs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`)
        cluster.fork()
    })

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`)
    })

    cluster.on('listening', (worker, address) => {
        console.log(`Worker ${worker.process.pid} is listening on ${address.address}:${address.port}`)
    })

    cluster.on('disconnect', (worker) => {
        console.log(`Worker ${worker.process.pid} has disconnected`)
    })

    setInterval(() => {
        const freeMem = os.freemem()
        const totalMem = os.totalmem()
        const memoryUsage = ((totalMem - freeMem) / totalMem) * 100
        const [load] = os.loadavg()
        console.log(`Memory Usage: ${memoryUsage.toFixed(2)}%`)
        console.log(`Load Average(1 min): ${load.toFixed(2)}`)
        if (load > 1) {
            console.warn('High load detected')
        }
    }, 10000)
} else {
    console.log(`CPU Count: ${os.cpus().length}`)
    console.log(`Free Memory: ${os.freemem()} bytes`)
    console.log(`Total Memory: ${os.totalmem()} bytes`)
    console.log(`Load Average: ${os.loadavg()}`)
    console.log(`Temp Directory: ${os.tmpdir()}`)
    console.log(`Platform: ${os.platform()}`)
    
    const app = express()
    initDatabase()

    app.use(rateLimiter())
    
    const httpServer = createServer(app)
    const io = socketIo(httpServer)
    
    app.use(cors())
    app.use(helmet())
    app.use(compression())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(csurf({ cookie: true }))
    app.use(requestLogger())
    app.use(validateJWT())
    
    app.use('/', express.static(path.join(__dirname, 'public')))
    app.use('/', root)
    app.use('/auth', authRoutes)
    app.use('/users', userRoutes)
    app.use('/groups', groupRoutes)
    app.use('/groups/:groupId/group-members', groupMemberRoutes)
    app.use('/groups/:groupId/group-messages', groupMessageRoutes)
    
    io.use(authMiddleware.socketAuth)
    .on('connection', (socket) => {
        console.log('a user connected', socket.decoded.userId)
        setUpSocketHandlers(io, socket)
    })

    app.all('*', (req, res) => {
        res.status(404)
        if(req.accepts('html')) {
            res.sendFile(path.join(__dirname, 'views', '404.html'))
        } else if (req.accepts('json')) {
            res.json({message: '404 Not Found'})
        } else {
            res.type('txt').send('404 Not Found')
        }
    })
    
    app.use(errorHandler)
    
    const PORT = process.env.PORT || 3000
    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}