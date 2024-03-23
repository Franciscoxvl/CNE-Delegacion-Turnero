from flask import Blueprint, render_template, render_template, jsonify, flash, redirect, url_for, request
from flask_login import  login_required, current_user
from website.models import Turnos, Usuario, db
from datetime import datetime

user = Blueprint('user', __name__)

def numero_turnos(id_servicio):
    turnos = Turnos.query.filter_by(id_servicio = id_servicio).all()
    cantidad_turnos = 0

    for turno in turnos:
        if turno.fecha == datetime.now().date():
            cantidad_turnos += 1

    return cantidad_turnos

def consultar_nombre(id):

    nombre = Usuario.query.filter_by(id=id).first().nombre
    apellido = Usuario.query.filter_by(id=id).first().apellido
    return nombre + " " + apellido

def consultar_tabla():

    turnos = Turnos.query.all()

    return turnos

def consultar_usuarios():

    usuarios = Usuario.query.all()

    return usuarios

@user.route("/summary")
@login_required
def summary():
    cd = numero_turnos(1)
    jfs = numero_turnos(2)
    dcv = numero_turnos(3)
    dfs = numero_turnos(4)

    usuario = consultar_nombre(current_user.id)
    return render_template("admin.html", usuario = usuario, cd = cd, jfs = jfs, dcv = dcv, dfs = dfs)


@user.route('/profile')
@login_required
def profile():
    if current_user.rol == "admin":
        return render_template("profile_information.html", nombre = current_user.nombre, apellido = current_user.apellido, rol = current_user.rol, username = current_user.username)
    
    elif current_user.rol == "ventanilla" :
        return render_template("profile_information_user.html", nombre = current_user.nombre, apellido = current_user.apellido, rol = current_user.rol, username = current_user.username)
    else: 
        return render_template("book.html")


@user.route('/profile_information')
@login_required
def profile_information():
    return render_template("profile_information.html", nombre = current_user.nombre, apellido = current_user.apellido, rol = current_user.rol, username = current_user.username)

@user.route('/reportes_g')
@login_required
def reportes_g():
    return render_template("reportes_general.html", turnos = consultar_tabla())

@user.route('/user_create')
@login_required
def user_create():
    return render_template("user_create.html")

@user.route('/user_management')
@login_required
def user_management():
    return render_template("user_management.html", usuarios = consultar_usuarios())

@user.route('/user_alter/<id_user>')
@login_required
def user_alter(id_user):
    print(id_user)
    return render_template("user_alter.html")

@user.route('/user_remove/<int:id_user>', methods=['DELETE'])
@login_required
def user_remove(id_user):
    usuario = Usuario.query.get(id_user)

    if usuario:
        db.session.delete(usuario)
        db.session.commit()
        flash("Usuario eliminado correctamente", 'success')
        return redirect(url_for('user.user_management'))
    else:
        flash("Usuario no encontrado", 'error')
        return redirect(url_for('user.user_management'))