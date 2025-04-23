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
    secret: "youshouldntseethis"
}))