from flask import Blueprint, render_template, flash, redirect, render_template, request, url_for
from flask_login import login_user, logout_user, login_required, current_user
from website.models import Usuario
from website import login_manager

auth = Blueprint('auth', __name__)

@login_manager.user_loader
def load_user(id):
    return Usuario.query.filter_by(id = id).first()


@auth.route('/login')
def login():
    if current_user.is_authenticated:
        if current_user.rol == "admin":
            return redirect(url_for('user.summary'))
        else:
            return redirect(url_for('user.profile'))
    
    else:
        return render_template("login.html")

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

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

        user = Usuario.query.filter_by(username=username).first()
        
        if not user:
            flash("Usuario no encontrado!")
            return redirect(url_for('auth.login'))
        
        elif user.check_password(password):
            if recuerdame:
                if user.rol == "recepcion":
                    login_user(user, remember=recuerdame)
                    return redirect(url_for('views.book'))
                elif user.rol == "admin":
                    login_user(user, remember=recuerdame)
                    return redirect(url_for('user.summary'))
                else:
                    login_user(user, remember=recuerdame)
                    return redirect(url_for('user.profile', rol = user.rol))
            else:
                if user.rol == "recepcion":
                    login_user(user)
                    return redirect(url_for('views.book'))
                elif user.rol == "admin":
                    login_user(user, remember=recuerdame)
                    return redirect(url_for('user.summary'))
                else:
                    login_user(user)
                    return redirect(url_for('user.profile', rol = user.rol))
        else:
            flash("La contraseña ingresada no es correcta!")
            return redirect(url_for('auth.login'))
    
    
def status_401(error):
    return redirect(url_for('auth.login'))
    
def status_404(error):
    return "<h1> Página no encontrada </h1>" , 404




        