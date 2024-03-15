var passwordInput = document.getElementById("password");
var error_message = document.getElementById("password-container");

var nuevoParrafo = document.createElement('p');

passwordInput.addEventListener("input", function() {
    var contraseña = passwordInput.value;

    // Expresión regular para validar la contraseña
    var patron = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?~-]).{8,}$/;

    if (patron.test(contraseña) || contraseña.length == 0) {
        nuevoParrafo.remove('p');
        var container_recfpass = document.getElementById('recuerdame-fpass-container');

        container_recfpass.style.marginTop = '2rem';
    } else {
        var container_recfpass = document.getElementById('recuerdame-fpass-container');

        container_recfpass.style.marginTop = '0';

        nuevoParrafo.textContent = "Se requiere al menos 8 caracteres, una mayúscula, un número y un caracter especial.";
        nuevoParrafo.style.color = 'red';
        nuevoParrafo.style.fontSize = '90%';
        nuevoParrafo.style.display = 'block';
        nuevoParrafo.style.margin = '0';
        error_message.insertAdjacentElement('afterend',nuevoParrafo);
    }
});