function PassCheck()
{
    let password = document.getElementById("pass");
    let confirmpass = document.getElementById("pass2");

    if(password.value !="" && confirmpass.value !="" && password.value == confirmpass.value)
    {
        password.style.borderColor = "green";
		confirmpass.style.borderColor = "green";
		document.getElementById("registerButton").disabled = false;

    } else{
        password.style.borderColor = "red";
		confirmpass.style.borderColor = "red";
		document.getElementById("registerButton").disabled = true;
    }
}