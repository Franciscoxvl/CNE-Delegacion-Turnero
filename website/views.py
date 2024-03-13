from flask import Blueprint, render_template

views = Blueprint('views', __name__)


@views.route('/')
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




