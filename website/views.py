from flask import Blueprint, render_template
from flask_login import  login_required, current_user

views = Blueprint('views', __name__)


@views.route('/')
@login_required
def book():
    return render_template("book.html")

@views.route('/visualizer')
def visualizer():

    return render_template("visualizer.html")

@views.route('/puestos')
def puestos():

    return render_template("puestos.html")

@views.route('/favicon.ico')
def favicon():

    return "favicon"




