// server.js
const http=require ("http")
const express=require ("express")
const cors=require("cors")
const socketIO=require("socket.io")

const users=[];

const port =4000 || process.env.PORT
const app=express()
app.get('/',(req,res)=>{
    res.send("ok working")
})

const server=http.createServer(app)

const io=socketIO(server)

io.on('connection',(socket)=>{
    console.log("New Connection ")


    socket.on('joined',({user})=>{
        users[socket.id]=user;
    
        console.log(`${user} is joined now! `);
    
        socket.broadcast.emit('userJoined', {user:'Admin :',message:` ${users[socket.id]} had joined` })
    
        socket.emit('welcome',{user:'Admin',message:`Welcome to chat ${users[socket.id]}`})
    
    })
    
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} is left`})
        console.log( "user is left")
    })

    socket.on("message",({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
        console.log("send message")

    })


})
server.listen(port,()=>{
    console.log(`running http  at http://localhost:${port}`)
})



