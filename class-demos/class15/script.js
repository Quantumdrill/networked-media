window.onload=()=>{
    searchButton.addEventListener("click",search)
}

async function search(){
    console.log("clicked")
    const inputText = inputTextBox.value
    const params = new URLSearchParams({
        apikey: "9aa8e798",
        s: inputText,
        type: "movie",
    })

    let url = "http://omdbapi.com/?" + params

    let response = await fetch(url)
    console.log(response)

    let jsonResponse = await response.json().then(success,error)
}

function success(response){
    let movies = response.search

    for (let m=0;m<movies.length;m++){
        let movie = movies[m]
        
    }
}

function error(err){
    console.log(err)
}