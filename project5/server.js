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
app.use(expressSession({
    store: nedbSession,
    cookie: {maxAge: 10**14},
    secret: "youshouldntseethis",
    resave: false,
    saveUninitialized: false
}))
app.set("view engine","ejs")
app.use(express.static("static"))
app.use(urlEncodedParser)

//global variables
let userData = {}
let loginStatus = false

//middleware for checking login status
function checkLoginStatus (req,res,next){
    if(req.session.loggedIn){
        loginStatus = true
        userData.ID = req.session.loggedIn
        udb.findOne({userID:userData.ID},(err,back)=>{
            userData.collection = back.collection
            next()
        })
        
    } else {
        res.redirect("/login?err=loginRequired")
    }
}

app.get("/", (req,res)=>{
    res.render("home.ejs")
})

app.get("/roam", checkLoginStatus, (req,res)=>{
    db.find({},(err,back)=>{
        res.render("roam.ejs",{data:back,loginStatus,page:{title:"Roaming the space",type:"roam"}})
    })
})

app.get("/collection", checkLoginStatus, (req,res)=>{
    db.find({_id:{$in:userData.collection}},(err,back)=>{
        
        res.render("roam.ejs",{data:back,loginStatus,page:{title:"My collection",type:"collection"}})
    })
})

app.post("/toCollection", (req,res)=>{
    udb.findOne({userID:userData.ID},(err,back)=>{
        if (back.collection.includes(req.query.collected)===false){
            back.collection.push(req.query.collected)
            userData.collection.push(req.query.collected)
            udb.update({userID:userData.ID},back,{},(err,back)=>{
                res.redirect("/")
            })
        }
    })
    
})

app.get("/trace", (req,res)=>{
    res.render("upload.ejs")
})
 
app.post("/upload", upload.array("fileUpload"), (req,res)=>{
    let data = {
        type: req.body.fileType,
        text: req.body.text,
        style: {
            modelType: req.body.modelType,
            shininess: req.body.shininess,
            color: req.body.color,
        },
        userID: userData.ID,
    }
    let filesArr = []
    for (let i=0;i<req.files.length;i++){
        filesArr.push(req.files[i].filename)
    }
    data.fileUrl = filesArr
    db.insert(data,(err,back)=>{
        res.redirect("/roam")
    })
    
})

app.get("/login", (req,res)=>{
    res.render("login.ejs")
})

app.get("/register", (req,res)=>{
    res.render("register.ejs")
})

app.post("/auth", upload.none(), (req,res)=>{
    if (req.body.userid&&req.body.password){
        udb.findOne({userID: req.body.userid}, (err,user)=>{
            if (err||user === null){
                res.redirect("/login?err=loginFailed")
            } else {
                if (bcrypt.compareSync(req.body.password, user.password)){
                    let session = req.session
                    session.loggedIn = user.userID
                    userData.ID = user.userID
                    userData.collection = user.collection
                    res.redirect("/roam")
                } else {
                    res.redirect("/login?err=loginFailed")
                }
            }
        })
    }
})

app.post("/newAccount", upload.none(), (req,res)=>{
    if (req.body.userid&&req.body.password){
        let newUser = {
            userID: req.body.userid,
            password: bcrypt.hashSync(req.body.password,10),
            collection: []
        }
        udb.findOne({userID: req.body.userid}, (err,user)=>{ //check if ID exists
            if (err||user === null){
                udb.insert(newUser,(err,user)=>{
                    res.redirect("/login")
                })
            } else {
                res.redirect("/register?err=accountExists")
            }
        })
    }
    
})

app.get("/logout", (req,res)=>{
    delete req.session.loggedIn
    delete userData.ID
    loginStatus = false
    res.redirect("/login") 
})

app.listen(8081, ()=>{
    console.log("http://127.0.0.1:8081")
})