var loginButton = document.getElementById("login-form");
var passwordInput = document.getElementById("password");
var userInput = document.getElementById("user");

loginButton.addEventListener('submit', (event) =>{
    user = userInput.value;
    password = passwordInput.value;
    console.log(user, password);

    if(user.length == 0 || password.length == 0){
        event.preventDefault();       
    }
});
