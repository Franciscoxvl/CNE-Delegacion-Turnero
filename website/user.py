from flask import Blueprint, render_template, render_template
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


@user.route('/profile')
@login_required
def profile():
    cd = numero_turnos(1)
    jfs = numero_turnos(2)
    dcv = numero_turnos(3)
    dfs = 5

    usuario = consultar_nombre(current_user.id)

    print(current_user.is_authenticated)
    return render_template("admin.html", usuario = usuario, cd = cd, jfs = jfs, dcv = dcv, dfs = dfs)