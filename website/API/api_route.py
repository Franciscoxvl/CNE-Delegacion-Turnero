import os
from flask import jsonify, request, flash, url_for, redirect
from . import api_bp
from website import socketio
from datetime import datetime
from website.models import Turnos, Espera, db, Puestos, Servicios, Usuario
from website.user import consultar_tabla
from sqlalchemy import text
from website.utils import *

#---------------------------------------------RUTAS---------------------------------------------------#
    
@api_bp.route('/')
def principal():
    return "<h1> HOLA MUNDO </h1>"

@api_bp.route('/ejemplo')
def ejemplo():
    return "<h1> HOLA MUNDO COMO EJEMPLO</h1>"


@api_bp.route('/generar_turno_espera', methods=['GET'])
def generar_turno_espera():

    resultado = generar_tespera()

    return resultado

@api_bp.route('/datos_diarios')
def datos_diarios():
    return jsonify(turnos_dia())

@api_bp.route('/datos_puestos')
def datos_puestos():
    return jsonify(turnos_puestos())

@api_bp.route('/generar_reporte', methods=['GET'])
def generar_reporte():
    if request.method == 'GET':
        try:
            fecha_inicio = request.args.get('fecha_inicio')
            fecha_fin = request.args.get('fecha_fin')

            if len(fecha_inicio) == 0 or len(fecha_fin) == 0:
                resultado = generacion_reporte()
                return "Reporte Generado exitosamente!", resultado
            else:
                resultado = generacion_reporte(fecha_inicio, fecha_fin)
                return "Reporte Generado exitosamente!", resultado

        except Exception as e:
            error = str(e)
            print(error)
            return error, 500
        
@api_bp.route('/generar_reporte_usuario', methods=['GET'])
def generar_reporte_usuario():

    if request.method == 'GET':
        try:
            fecha_inicio = request.args.get('fecha_inicio')
            fecha_fin = request.args.get('fecha_fin')
            rol = request.args.get('rol')
            id_user = request.args.get('id_user')

            if len(fecha_inicio) == 0 or len(fecha_fin) == 0:
                resultado = generacion_reporte_usuario(0, 0, rol, id_user)
                return "Reporte Generado exitosamente!", resultado
            else:
                resultado = generacion_reporte_usuario(fecha_inicio, fecha_fin, rol, id_user)
                return "Reporte Generado exitosamente!", resultado
            

        except Exception as e:
            error = str(e)
            print(error)
            return error, 500

@api_bp.route('/crear_usuario', methods=['POST'])
def crear_usuario():
    if request.method == 'POST':
        nuevo_id = siguiente_id_disponible() 
        username = request.form['username']
        password = request.form['password']
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        rol = request.form['rol']
        puesto = request.form['puesto']

        usuario_existente = Usuario.query.filter_by(username = username).first()
        puesto_verificar = Puestos.query.filter_by(descripcion = puesto).first()

        if usuario_existente:
            flash("El nombre de Usuario ya existe")
            return redirect(url_for('user.user_create'))
        elif rol == "Ventanilla" and puesto_verificar.id_user != None:
            flash("El puesto seleccionado ya tiene un usuario asignado")
            return redirect(url_for('user.user_create'))            
        else:
            nuevo_usuario = Usuario(id = nuevo_id, username = username, nombre = nombre, apellido = apellido, rol = rol, puesto= puesto)

            nuevo_usuario.set_password(password)

            db.session.add(nuevo_usuario)
            db.session.commit()

            if rol == "Ventanilla":
                puesto = Puestos.query.filter_by(descripcion = puesto).first()
                puesto.id_user = nuevo_id
                db.session.commit()

            flash("El Usuario fue creado correctamente", 'success')
            return redirect(url_for('user.user_management'))

@api_bp.route('/modificar_usuario', methods=['POST'])
def modificar_usuario():
    if request.method == 'POST':
        id = request.form['id']
        username = request.form['username']
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        rol = request.form['rol']
        puesto = request.form['puesto']

        usuario_modificar = Usuario.query.filter_by(id = id).first()

        usuario_modificar.nombre = nombre
        usuario_modificar.apellido = apellido
        usuario_modificar.username = username
        usuario_modificar.rol = rol
        usuario_modificar.puesto = puesto
        db.session.commit()
        flash("El Usuario fue modificado correctamente", 'success')
        return redirect(url_for('user.user_management'))

@api_bp.route('/resetear_usuario', methods=['POST'])
def resetear_usuario():
    if request.method == 'POST':
        id = request.form['id']
        password = request.form['password']

        usuario_modificar = Usuario.query.filter_by(id = id).first()
        usuario_modificar.cambiar_password(password)

        flash("La contraseña fue reseteada correctamente", 'success')
        return redirect(url_for('user.user_management'))

@api_bp.route('/actualizar_tabla', methods=['GET'])
def actualizar_tabla():
    id_user = request.args.get('id_user')
    turnos = consultar_tabla(2)
    turnos_serial = []

    for turno in turnos:
        turnos_serial.append(turno.to_dict())
    
    respuesta = {
        'turnos': turnos_serial,
        'pendiente': False
    }

    asignados = Turnos.query.filter_by(estado_turno = "Asignado").all()
    
    for asignado in asignados:
        if str(asignado.puesto.id_user) == id_user:
            respuesta = {
                'turnos': turnos_serial,
                'pendiente': True
            }

    return jsonify(respuesta)

@api_bp.route('/calificar_atencion', methods=['GET'])
def calificar_atencion():
    puesto = request.args.get('puesto')
    calificacion = request.args.get('calificacion')
    resultado = calificacion_atencion(puesto, calificacion)
    return jsonify(resultado)
     
    
@socketio.on('connect')
def handle_connect():
    print('Cliente conectado.')

@socketio.on('liberar_puesto')
def handle_liberar_puesto(data):
    # Lógica para liberar el puesto y asignar un nuevo turno
    socketio.emit('espera_asignacion',"Tiempo de espera")
    liberar_turno(data['puestoId'])
    asignar_turno(data['puestoId'])




    


 
