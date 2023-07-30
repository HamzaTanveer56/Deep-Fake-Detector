function nameValidator(elementOne)
{
    let regex = /^[A-Za-z]+$/;
    if(elementOne ==="" || elementOne == null)
        throw "Name cannot be Null";
    else if(!(elementOne.match(regex)))
        throw "Name cannot contain a special character or a number!";
    else
        return;
}

function emailValidator(email)
{
    if(email === "" || email == null)
        throw "Email is Required!";
    else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
        throw "Invalid Email Pattern!";
    else
        return;
}

function passValidator(elementOne)
{
    if(elementOne === "" || elementOne == null)
        throw "Password is Required!";
    else if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).test(elementOne))
        throw "Password must be between 8-15 characters and should contain a number, a special character, a lower case and an upper case letter!"
    else
        return;
}

function passEqualityChecker(pass,cpass)
{
    if(pass !== cpass)
    {
        throw "Both Passwords must've same value";
    }
    else
        return;
}


module.exports = {nameValidator,emailValidator,passValidator,passEqualityChecker}