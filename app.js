const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)

app.use(express.static(__dirname + '/public'))

const io = socketIo.listen(server);

server.listen(3000,()=>{
    console.log("running");
})

app.use(express.static(__dirname + "/public"));

io.on('connection',(socket)=>{
    console.log('Nova conexão!');


    socket.on('draw', (line) => {
        io.emit('draw', line);
    })


})
