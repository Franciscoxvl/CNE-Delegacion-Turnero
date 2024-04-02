from flask import Blueprint, render_template, render_template, jsonify, flash, redirect, url_for, request, after_this_request
from flask_login import  login_required, current_user
from website.models import Turnos, Usuario, db, Espera
import matplotlib.pyplot as plt
from datetime import datetime
from docxtpl import DocxTemplate
from docx.shared import Inches

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

def consultar_tabla(opcion):
    if opcion == 1:        
        turnos = Turnos.query.all()
    else:
        turnos = Espera.query.all()
    return turnos

def consultar_usuarios():
    usuarios = Usuario.query.all()
    return usuarios

@user.route("/summary")
@login_required
def summary():

    if current_user.rol == "Admin":
        cd = numero_turnos(1)
        jfs = numero_turnos(2)
        dcv = numero_turnos(3)
        dfs = numero_turnos(4)

        usuario = consultar_nombre(current_user.id)
        return render_template("admin.html", usuario = usuario, cd = cd, jfs = jfs, dcv = dcv, dfs = dfs)
    
    elif current_user.rol == "Ventanilla" :
        return redirect(url_for('user.profile'))
    
    else:         
        return redirect(url_for('user.profile'))
    

@user.route('/profile')
@login_required
def profile():
    if current_user.rol == "Admin":
        return render_template("profile_information.html", nombre = current_user.nombre, apellido = current_user.apellido, rol = current_user.rol, username = current_user.username)
    
    elif current_user.rol == "Ventanilla" :        
        return render_template("profile_information_user.html", nombre = current_user.nombre, apellido = current_user.apellido, rol = current_user.rol, username = current_user.username)
    else: 
        return render_template("book.html")


@user.route('/profile_information')
@login_required
def profile_information():
    return redirect(url_for('user.profile'))

@user.route('/reportes_g')
@login_required
def reportes_g():

    if current_user.rol == "Admin":
        return render_template("reportes_general.html", turnos = consultar_tabla(1))
    
    elif current_user.rol == "Ventanilla":
        
        return redirect(url_for('user.profile'))
    else:
         
        return redirect(url_for('user.profile'))


@user.route('/user_create')
@login_required
def user_create():
    
    if current_user.rol == "Admin":
        return render_template("user_create.html")
    
    elif current_user.rol == "Ventanilla" :
        return redirect(url_for('user.profile'))
    
    else:
        return redirect(url_for('user.profile'))


@user.route('/user_management')
@login_required
def user_management():

    if current_user.rol == "Admin":
        return render_template("user_management.html", usuarios = consultar_usuarios())
    
    elif current_user.rol == "Ventanilla" :
        return redirect(url_for('user.profile'))
    
    else:
        return redirect(url_for('user.profile'))

    
@user.route('/user_alter/<id_user>')
@login_required
def user_alter(id_user):

    if current_user.rol == "Admin":
        user_to_modificate = Usuario.query.filter_by(id = id_user).first()
        nombre = user_to_modificate.nombre
        apellido = user_to_modificate.apellido
        username = user_to_modificate.username
        rol = user_to_modificate.rol
        puesto = user_to_modificate.puesto

        return render_template("user_alter.html",user_id = id_user,user_nombre = nombre, user_apellido = apellido, user_username = username, user_rol = rol, user_puesto = puesto )
    
    elif current_user.rol == "Ventanilla" :
        return redirect(url_for('user.profile'))
    
    else:
        return redirect(url_for('user.profile'))

    

@user.route('/user_remove/<int:id_user>', methods=['DELETE'])
@login_required
def user_remove(id_user):

    if current_user.rol == "Admin":
        usuario = Usuario.query.get(id_user)

        if usuario:
            db.session.delete(usuario)
            db.session.commit()

            registros_actualizar = Usuario.query.filter(Usuario.id > id_user).all()
            # Actualiza los índices de los registros restantes
            for registro in registros_actualizar:
                registro.id -= 1
            db.session.commit()

            flash("Usuario eliminado correctamente", 'success')
            return redirect(url_for('user.user_management'))
        else:
            
            flash("Usuario no encontrado", 'error')
            return redirect(url_for('user.user_management'))
    
    elif current_user.rol == "Ventanilla" :
        return redirect(url_for('user.profile'))
    
    else:
        return redirect(url_for('user.profile'))
 

@user.route('/user_reset/<id_user>')
@login_required
def user_reset(id_user):

    if current_user.rol == "Admin":
        return render_template("user_reset.html",user_id = id_user)
    
    elif current_user.rol == "Ventanilla":
        return redirect(url_for('user.profile'))
    
    else:
        return redirect(url_for('user.profile'))

@user.route('/asig_turnos/<puesto>')
@login_required
def asig_turnos(puesto):

    if current_user.rol == "Admin":
        return redirect(url_for('user.profile'))
    
    elif current_user.rol == "Ventanilla":
        return render_template("puestos.html", puesto = puesto)
    
    else:
        return redirect(url_for('user.profile'))

@user.route('/user_report/<id_user>')
@login_required
def user_report(id_user):

    user = Usuario.query.filter_by(id=id_user).first()
    rol = user.puesto

    if current_user.rol == "Admin":
        return render_template("user_report.html", user_rol = rol, id_user = id_user)
    elif current_user.rol == "Ventanilla" :
        return redirect(url_for('user.profile'))
    
    else:
        return redirect(url_for('user.profile'))
    


    