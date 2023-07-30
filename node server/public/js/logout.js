const logout = document.getElementById('logOut').addEventListener('click',e=>{
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location = 'http://localhost:3000/login';
})

