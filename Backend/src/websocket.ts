import { WebSocketServer } from "ws";


const wss = new WebSocketServer({
    port : 8080
})
console.log("The WebSocket is running on the PORT"+8000)

wss.on("connection",(socket)=>{
    console.log("User Connected")

    socket.on("message",(message)=>{
        const data = JSON.parse(message.toString())
        console.log("Message",data.message)


        wss.clients.forEach((user)=>{
            if (user.readyState === 1){
                user.send(JSON.stringify({
                    message:data.message
                }))
            }
        })
    })


    socket.on('close',()=>{
        console.log("User Disconnected")
    })
})