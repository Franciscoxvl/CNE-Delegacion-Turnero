from flask import Blueprint, render_template
from flask import flash, redirect, render_template, request, url_for

auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    return render_template("login.html")

@auth.route('/logout')
def logout():
    return "<p>LOGOUT PAGE</p>"

@auth.route('/sing-up')
def sign_up():
    return "<p>SIGN-UP PAGE</p>"

@auth.route('/validacion_usuario', methods=['POST'])
def validacion_usuario():
    from website.models import Usuario

    if request.method == 'POST':
        # Obtener los datos del formulario
        username = request.form['username']
        password = request.form['password']
        recuerdame = True if 'recuerdame' in request.form else False
        print("Probando debugger")

        user = Usuario.query.filter_by(username=username).first()
        
        if not user:
            flash("Usuario no encontrado!")
            return redirect(url_for('auth.login'))
        
        elif user.check_password(password):
            return redirect(url_for('user.profile'))
        
        else:
            flash("La contraseña ingresada no es correcta!")
            return redirect(url_for('auth.login'))



        