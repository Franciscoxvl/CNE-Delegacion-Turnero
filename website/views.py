from flask import Blueprint, render_template, redirect, send_from_directory, url_for
from flask_login import  login_required, current_user

views = Blueprint('views', __name__)


@views.route('/')
def book():
    if current_user.is_authenticated:
        if current_user.rol == "recepcion":
            return render_template("book.html")
        else:
            return redirect(url_for('auth.login'))
    else:
        return render_template("login.html")

@views.route('/visualizer')
def visualizer():

    return render_template("visualizer.html")

@views.route('/satisfaccion/<id_ventanilla>')
def satisfaccion(id_ventanilla):
    return render_template("satisfaccion.html", id_ventanilla = id_ventanilla)

@views.route('/favicon.ico')
def favicon():
    return "favicon"




