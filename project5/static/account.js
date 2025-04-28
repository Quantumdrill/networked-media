const query = new URLSearchParams(window.location.search)
switch (query.get("err")){
    case "loginFailed":
        alert("ID and Password don't match")
        break
    case "loginRequired":
        alert("Login Required to proceed")
        break
    case "accountExists":
        alert("ID already exists")
        break
}
