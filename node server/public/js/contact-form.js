const username = document.getElementById("name");
const nameError = document.getElementById("nameError");
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

document.getElementById("form").addEventListener("submit",e=>{
    //Name validation
    nameValidator(username,nameError);

    //Email Validation
    emailValidator(email,emailError);

    //prevents form submission in case of an error
    if(errorCount>0)
        e.preventDefault();
    
    errorCount = 0;
})



username.addEventListener("input",e=>{
    username.style.border = "1px solid #ccc";
    nameError.innerHTML = "";
})

email.addEventListener("input",e=>{
    email.style.border = "1px solid #ccc";
    emailError.innerHTML = "";
})