require("dotenv").config()
const fs = require("fs")

const m = require("masto")

const masto = m.createRestAPIClient({
    url: "https://networked-media.itp.io/",
    accessToken: process.env.TOKEN
})

async function makeStatus(text){
    const status = await masto.v1.statuses.create({
        //what will be posted
        status: text,
        visibility: "public" //private for testing, public for final publish
    })
    //console.log(status.url)
}

let key1s = ["emotions","actions"]

setInterval (()=>{
    let kaomojis = JSON.parse(fs.readFileSync("kaomoji.json")) //credit: https://github.com/codingstark-dev/kaomoji
    let key1 = key1s[Math.floor(Math.random()*2)]
    let key2 = Object.keys(kaomojis[key1])[Math.floor(Math.random()*Object.keys(kaomojis[key1]).length)]
    let result = kaomojis[key1][key2][Math.floor(Math.random()*kaomojis[key1][key2].length)]
    let nowdate = new Date()
    let now = nowdate.toLocaleString()
    let sentence = "It's now "+now+", I be like:\n"+result
    makeStatus(sentence)
}, 4387000)