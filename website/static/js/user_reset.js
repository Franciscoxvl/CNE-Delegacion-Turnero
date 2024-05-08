
document.getElementById('user-reset-form').addEventListener('submit', (event) => {
    // Prevenir el envío predeterminado del formulario
    var password = document.getElementById("password");
    var repeat_password = document.getElementById("repeat-password");

    if (password.value != repeat_password.value){
        event.preventDefault();
        alert("Las constraseñas deben ser iguales!")
    }
    

});