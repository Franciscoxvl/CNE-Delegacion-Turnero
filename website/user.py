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

def consultar_turnos_servicio():
    total_turnos = Turnos.query.count() + 10
    total_cd = Turnos.query.filter_by(id_servicio = 1).count()
    total_jfs = Turnos.query.filter_by(id_servicio = 2).count()
    total_dcv = Turnos.query.filter_by(id_servicio = 3).count()
    total_dfs = 10

    p_cd = round((total_cd / total_turnos) * 100)
    p_jfs = round((total_jfs / total_turnos) * 100)
    p_dcv = round((total_dcv / total_turnos) * 100)
    p_dfs = round((total_dfs / total_turnos) * 100)

    porcentajes = [str(p_cd) + "%", str(p_jfs) + "%", str(p_dcv) + "%", str(p_dfs) + "%"]

    return porcentajes


@user.route('/profile')
@login_required
def profile():
    cd = numero_turnos(1)
    jfs = numero_turnos(2)
    dcv = numero_turnos(3)
    dfs = 5

    usuario = consultar_nombre(current_user.id)
    porcentajes = consultar_turnos_servicio()
    print(porcentajes)
    return render_template("admin.html", usuario = usuario, cd = cd, jfs = jfs, dcv = dcv, dfs = dfs, p_cd = porcentajes[0], p_jfs = porcentajes[1], p_dcv =porcentajes[2] , p_dfs = porcentajes[3])

@user.route('/profile_information')
@login_required
def profile_information():

    return render_template("profile_information.html", nombre = current_user.nombre, apellido = current_user.apellido, rol = current_user.rol, username = current_user.username)