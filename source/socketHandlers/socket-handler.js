import groupMessageHandler from './group-message-handler.js'


const setUpSocketHandlers = (io) => {
    io.on('connection', (sokcet) => {
        console.log('A user connected')

        groupMessageHandler(io, socket)

        socket.on('disconnect', () => {
            console.log('A user disconnected')
        })
    })
}

export default setUpSocketHandlers