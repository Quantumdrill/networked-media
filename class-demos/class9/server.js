const express = require("express")

const app = express()

app.use(express.status("public"))

app.get("/",(request,response)=>{
    response.send("test server is working")
})

app.get("/image", (request,response)=>{
    response.sendFile("image.jpeg",{root:"public"})
})

app.get("/submit", (request,response)=>{
    console.log(request.query)
})

app.listen(5555,()=>{
    console.log("http://127.0.0.1:5555")
})