const express = require("express")
const app = express()

app.use(express.static("static"))
let data=[]
app.set("view engine", "ejs")

app.get("/",(req,res)=>{
    res.render("index.ejs")
})

app.post("/submit",(req,res)=>{
    //res.send(req.query.username)
    data.push(req.query)
    //console.log(data)
    res.render("submit.ejs", {all:data})
})

app.listen(5555,()=>{
    console.log("http://127.0.0.1:5555")
})