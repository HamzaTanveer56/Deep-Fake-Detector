const fname = document.getElementById("fname");
const fnameError = document.getElementById("fnameError");
const lname = document.getElementById("lname");
const lnameError = document.getElementById("lnameError");
const pass = document.getElementById("pass");
const passError = document.getElementById("passError");
const cpass = document.getElementById("cpass");
const cpassError = document.getElementById("cpassError");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
let errorCount = 0;

//Sets the password style
function errorStyles(elementOne,elementTwo)
{
    elementOne.style.border = "2px solid #d9534f";
    elementTwo.style.color = "#d9534f";
    elementTwo.style.textAlign = "left";
}


function nameValidator(elementOne,elementTwo)
{
    let regex = /^[A-Za-z ]+$/;
    if(elementOne.value ==="" || elementOne.value == null)
    {
        errorStyles(elementOne,elementTwo);
        elementTwo.innerHTML = "Name is Required!"
        errorCount++;
    }
    else if(!(elementOne.value.match(regex)))
    {
        errorStyles(elementOne,elementTwo);
        elementTwo.innerHTML = "Name cannot contain a special character or a number!"
        errorCount++;
    }
    else
        return;
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
    else
        return;
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


document.getElementById("form").addEventListener("submit",e=>{
    //Name validation
    nameValidator(fname,fnameError);
    nameValidator(lname,lnameError);
    
    //Email validation
    emailValidator();

    //Password Validation
    passValidator(pass,passError);
    passValidator(cpass,cpassError);

    //Checks if passwods are equal
    passEqualityChecker();

    //prevents form submission in case of an error
    if(errorCount>0)
        e.preventDefault();
    
    errorCount = 0;
})

fname.addEventListener("input",e=>{
    fname.style.border = "1px solid #ccc";
    fnameError.innerHTML = "";
})

lname.addEventListener("input",e=>{
    lname.style.border = "1px solid #ccc";
    lnameError.innerHTML = "";
})

email.addEventListener("input",e=>{
    email.style.border = "1px solid #ccc";
    emailError.innerHTML = "";
})

pass.addEventListener("input",e=>{
    pass.style.border = "1px solid #ccc";
    passError.innerHTML = "";
})

cpass.addEventListener("input",e=>{
    cpass.style.border = "1px solid #ccc";
    cpassError.innerHTML = "";
})