//import
const express = require("express")
const multer = require("multer")
const bodyParser = require("body-parser")
const nedb = require("@seald-io/nedb")
const expressSession = require('express-session')
const nedbSessionStore = require('nedb-promises-session-store')
const bcrypt = require('bcrypt')

//instantiate
const app = express();
const urlEncodedParser = bodyParser.urlencoded({ extended: true })
const upload = multer({ dest: "static/uploads" })

//databases
let db = new nedb({ filename: "database.txt", autoload: true })
let udb = new nedb({ filename: "userDatabase.txt", autoload: true })
const nedbSession = nedbSessionStore({ connect: expressSession, filename: 'sessions.txt'})

//middleware settings
// app.use(expressSession({
//     store: nedbSession,
//     cookie: {maxAge: 10**14},
//     secret: "youshouldntseethis"
// }))
app.set("view engine","ejs")
app.use(express.static("static"))

//global variables
let accountPage = {title:"Login",type:"login"}
let userData = {}

app.get("/", (req,res)=>{
    res.render("home.ejs")
}) 

app.get("/login", (req,res)=>{
    accountPage = {title:"Login",type:"login"}
    res.render("account.ejs",{account:accountPage})
})

app.get("/register", (req,res)=>{
    accountPage = {title:"Register",type:"register"}
    res.render("account.ejs",{account:accountPage})
})

app.post("/auth", (req,res)=>{
    udb.findOne({userID: req.body.id}, (err,user)=>{
        if (err||user === null){
            //login not success
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)){
                res.redirect("/collections")
            } else {
                //login not success
            }
        }
    })
})

app.post("/newAccount", (req,res)=>{
    let newUser = {
        userID: req.body.id,
        password: bcrypt.hashSync(req.body.password,10)
    }
    udb.insert(newUser,(err,data)=>{
        res.redirect("/collections")
    })
})

app.listen(8081, ()=>{
    console.log("http://127.0.0.1:8081")
})