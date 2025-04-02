require("dotenv").config()

const m = require("masto")

const masto = m.createRestAPIClient({
    url: "https://networked-media.itp.io/",
    accessToken: process.env.TOKEN
})

async function makeStatus(text){
    const status = await masto.v1.statuses.create({
        //what will be posted
        status: text,
        visibility: "private" //private for testing, public for final publish
    })

    console.log(status.url)
}

makeStatus("hi")

setInterval (()=>{
    let arr=["one","two","three"]
    let randIndex = Math.floor(Math.random()*arr.length)
    let post = arr[randIndex]
    makeStatus(post)
},3000)