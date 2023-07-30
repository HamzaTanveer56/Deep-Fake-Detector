const pass = document.getElementById("pass");
const passError = document.getElementById("passError");
const cpass = document.getElementById("cpass");
const cpassError = document.getElementById("cpassError");
//const resetBtn = document.getElementById('reset-btn');

let errorCount = 0;

//Sets the password style
function errorStyles(elementOne,elementTwo)
{
    elementOne.style.border = "2px solid #d9534f";
    elementTwo.style.color = "#d9534f";
    elementTwo.style.textAlign = "left";
}

function passValidator(elementOne,elementTwo)
{
    if(elementOne.value === "" || elementOne.value == null)
    {
        errorStyles(elementOne,elementTwo);
        elementTwo.innerHTML = "Password is Required!"
        errorCount++;
    }
    else if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).test(elementOne.value))
    {
        errorStyles(elementOne,elementTwo);
        elementTwo.innerHTML = "Password must be between 8-15 characters and should contain a number, a special character, a lower case and an upper case letter!"
        errorCount++;
    }
    else
        return;
}

function passEqualityChecker()
{
    if(pass.value !== cpass.value)
    {
        errorStyles(pass,passError);
        passError.innerHTML = "Both Passwords must've same value";
        errorCount++;
    }
    else
        return;
}

document.getElementById("form").addEventListener("submit",e=>{

    //Password Validation
    passValidator(pass,passError);
    passValidator(cpass,cpassError);

    //Checks if passwords are equal
    passEqualityChecker();

    //prevents form submission in case of an error
    if(errorCount>0)
        e.preventDefault();

    /*fetch("localhost:3000/reset-password",{
        method: "POST",
        body: JSON.stringify({
            pass: pass,
            cpass: cpass 
        }), headers: {
            "Content-type":"application/json; charset=UTF-8"
        }
    }).then(res => res.json()).then(res => console.log(res + 'It came here'));
    */
    errorCount = 0;
})

//Set the visibility of password and confirm password
document.querySelector("#passCheck").addEventListener("click", e=>{
    if(document.querySelector("#pass").getAttribute("type")==="password"){
        document.querySelector("#pass").setAttribute("type","text");
        document.querySelector("#cpass").setAttribute("type","text");  
    }
    else{
        document.querySelector("#pass").setAttribute("type","password");
        document.querySelector("#cpass").setAttribute("type","password");
    }
});

pass.addEventListener("input",e=>{
    pass.style.border = "1px solid #ccc";
    passError.innerHTML = "";
})

cpass.addEventListener("input",e=>{
    cpass.style.border = "1px solid #ccc";
    cpassError.innerHTML = "";
})