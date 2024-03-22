var createButton = document.getElementById("user-create-form");
var userInput = document.getElementById("username");
var passwordInput = document.getElementById("password");
var nameInput = document.getElementById("nombre");
var lastnameInput = document.getElementById("apellido");
var rolInput = document.getElementById("rol");
var puestoInput = document.getElementById("puesto");

createButton.addEventListener('submit', (event) =>{
    user = userInput.value;
    password = passwordInput.value;
    nombre = nameInput.value;
    apellido = lastnameInput.value;
    rol = rolInput.value;
    puesto = puestoInput.value;

    console.log(user, password);

    if(user.length == 0 || password.length == 0 || nombre.length == 0 || apellido.length == 0 || rol.length == 0 || puesto.length == 0 ){
        event.preventDefault();    
        alert("Todos los campos deben estar llenos")   
    }
});
