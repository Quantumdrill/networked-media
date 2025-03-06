const express = require("express")

const app = express()

app.use(express.static("public"))
app.set("view engine","ejs")

app.get("/",(request,response)=>{
    response.send("test server is working")
})

// app.get("/image", (request,response)=>{
//     response.sendFile("image.jpeg",{root:"public"})
// })
let posts = []
app.get("/submit", (request,response)=>{
    console.log(request.query)
    posts.push({
        username: request.query.user,
        message: request.query.message

    })
    response.send("thank you for submitting, "+"<a href=\"\/index.html\">back to home</a>")
})

app.get("/posts",(request,response)=>{
    let allPosts = ""
    for (let i=0;i<posts.length;i++){
        allPosts += posts[i].username + "says" + posts[i].message + "<br />"
        response.send(allPosts)
    }
})

app.get("/template",(req,res)=>{
    res.render("template.ejs")
})

app.listen(5555,()=>{
    console.log("http://127.0.0.1:5555")
})