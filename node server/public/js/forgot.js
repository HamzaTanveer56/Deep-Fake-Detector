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


document.getElementById("form").addEventListener("submit",e=>{
    //Email validation
    emailValidator();

    //prevents form submission in case of an error
    if(errorCount>0)
        e.preventDefault();
    errorCount = 0;
})

email.addEventListener("input",e=>{
    email.style.border = "1px solid #ccc";
    emailError.innerHTML = "";
})