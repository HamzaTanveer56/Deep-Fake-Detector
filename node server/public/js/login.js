const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const pass = document.getElementById("pass");
const passError = document.getElementById("passError");
let errorCount = 0;

//Sets the password style
function errorStyles(elementOne,elementTwo)
{
    elementOne.style.border = "2px solid #d9534f";
    elementTwo.style.color = "#d9534f";
    elementTwo.style.textAlign = "left";
}

function emailValidator()
{
    if(email.value === "" || email.value == null)
    {
        errorStyles(email,emailError);
        emailError.innerHTML = "Email is Required!"
        errorCount++;
    }
    else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)))
    {
        errorStyles(email,emailError);
        emailError.innerHTML = "Invalid Email Pattern!"
        errorCount++;
    }
}

function passValidator()
{
    if(pass.value === "" || pass.value == null)
    {
        errorStyles(pass,passError);
        passError.innerHTML = "Password is Required!"
        errorCount++;
    }
    else if(pass.value.length < 8 || pass.value.length > 15)
    {
        errorStyles(pass,passError);
        passError.innerHTML = "Password must be between 8-15 characters!"
        errorCount++;
    }
}

//Set the visibility of password and confirm password
document.querySelector("#passCheck").addEventListener("click", e=>{
    if(document.querySelector("#pass").getAttribute("type")==="password")
        document.querySelector("#pass").setAttribute("type","text"); 
    else
        document.querySelector("#pass").setAttribute("type","password");
});


document.getElementById("form").addEventListener("submit",e=>{
    //Email validation
    emailValidator();

    //Password Validation
    passValidator();

    //prevents form submission in case of an error
    if(errorCount>0)
        e.preventDefault();
    
    errorCount = 0;
})



email.addEventListener("input",e=>{
    email.style.border = "1px solid #ccc";
    emailError.innerHTML = "";
})

pass.addEventListener("input",e=>{
    pass.style.border = "1px solid #ccc";
    passError.innerHTML = "";
})