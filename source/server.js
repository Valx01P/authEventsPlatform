import setUpSocketHandlers from './socketHandlers/socket-handler.js'
import requestLogger from './middlewares/requestLogger.js'
import errorHandler from './middlewares/errorHandler.js'
import rateLimiter from './middleware/rateLimite.jsr'

import groupMessageRoutes from './routes/groupMessageRoutes.js'
import groupMemberRoutes from './routes/groupMemberRoutes.js'
import groupRoutes from './routes/groupRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import root from './routes/root.js'

import { initDatabase } from './config/initDatabase.js'
import { corsOptions } from './config/allowedOrigins.js'

import cookieParser from 'cookie-parser'
import compression from 'compression'
import { Server } from 'socket.io'
import helmet from 'helmet'
import csurf from 'csurf'
import cors from 'cors'

import { createServer } from 'http'
import express from 'express'
import cluster from 'cluster'
import path from 'path'
import os from 'os'


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
    const httpServer = createServer(app)
    const io = new Server(httpServer)

    initDatabase()
    
    app.use(cors(corsOptions))
    app.use(rateLimiter())
    app.use(helmet())
    app.use(compression())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(csurf({ cookie: true }))
    app.use(requestLogger())
    
    app.use('/', express.static(path.join(__dirname, 'public')))
    app.use('/', root)
    app.use('/auth', authRoutes)
    app.use('/users', userRoutes)
    app.use('/groups', groupRoutes)
    app.use('/groups/:groupId/members', groupMemberRoutes)
    app.use('/groups/:groupId/messages', groupMessageRoutes)
    
    setUpSocketHandlers(io)

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