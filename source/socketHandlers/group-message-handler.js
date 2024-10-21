const groupMessageHandler = (io, socket) => {
    // socket.on('event', (data) => {
    //      do something
    //      io.emit('event', data)
    // })
    socket.on('group-message', (data) => {
        io.to(data.groupId).emit('group-message', data)
    })

}

export default groupMessageHandler