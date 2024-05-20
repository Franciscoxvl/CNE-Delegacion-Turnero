var loginButton = document.getElementById("login-form");
var passwordInput = document.getElementById("password");
var userInput = document.getElementById("user");
// var provincias = ["Azuay", "Bolivar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Rios", "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena", "Santo Domingo de los Tsáchilas", "Sucumbios", "Tungurahua", "Zamora Chinchipe", "NACIONAL"]

// var select = document.getElementById("province");

// provincias.forEach(function(provincia) {
//     // Crear un elemento de opción
//     var option = document.createElement("option");
//     // Establecer el valor y texto de la opción
//     option.value = provincia;
//     option.text = provincia;
//     // Agregar la opción al elemento select
//     select.appendChild(option);
// });

loginButton.addEventListener('submit', (event) =>{
    user = userInput.value;
    password = passwordInput.value;
    console.log(user, password);

    if(user.length == 0 || password.length == 0){
        event.preventDefault();       
    }
});
