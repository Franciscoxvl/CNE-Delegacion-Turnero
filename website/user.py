from flask import Blueprint, render_template, render_template, jsonify
from flask_login import  login_required, current_user
from website.models import Turnos, Usuario

user = Blueprint('user', __name__)

def numero_turnos(id_servicio):
    cantidad_turnos = Turnos.query.filter_by(id_servicio = id_servicio).count()
    return cantidad_turnos

def consultar_nombre(id):

    nombre = Usuario.query.filter_by(id=id).first().nombre
    apellido = Usuario.query.filter_by(id=id).first().apellido
    return nombre + " " + apellido

def consultar_tabla():

    turnos = Turnos.query.all()

    return turnos

@user.route('/profile')
@login_required
def profile():
    cd = numero_turnos(1)
    jfs = numero_turnos(2)
    dcv = numero_turnos(3)
    dfs = 5

    usuario = consultar_nombre(current_user.id)
    return render_template("admin.html", usuario = usuario, cd = cd, jfs = jfs, dcv = dcv, dfs = dfs)

@user.route('/profile_information')
@login_required
def profile_information():

    return render_template("profile_information.html", nombre = current_user.nombre, apellido = current_user.apellido, rol = current_user.rol, username = current_user.username)

@user.route('/reportes_g')
@login_required
def reportes_g():
    return render_template("reportes_general.html", turnos = consultar_tabla())