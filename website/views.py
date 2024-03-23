from flask import Blueprint, render_template, redirect, url_for
from flask_login import  login_required, current_user

views = Blueprint('views', __name__)


@views.route('/')
@login_required
def book():
    if current_user.rol == "recepcion":
        return render_template("book.html")
    else:
        return redirect(url_for('auth.login'))

@views.route('/visualizer')
def visualizer():

    return render_template("visualizer.html")

@views.route('/puestos')
def puestos():

    return render_template("puestos.html")

@views.route('/favicon.ico')
def favicon():

    return "favicon"




