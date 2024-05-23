from flask import jsonify, request, flash, url_for, redirect
from . import api_bp
from website import socketio
from website.models import Turnos, db, Puestos, Usuario
from website.user import consultar_tabla
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

    turno, tiempo = generar_tespera()
    respuesta = {'turno' : turno, 'tiempo' : tiempo}
    enviar = jsonify(respuesta)
    return enviar

@api_bp.route('/datos_diarios')
def datos_diarios():
    return jsonify(turnos_dia())

@api_bp.route('/datos_puestos')
def datos_puestos():
    data_puestos = turnos_puestos()
    print(data_puestos)
    return jsonify(data_puestos)

@api_bp.route('/generar_reporte', methods=['GET'])
def generar_reporte():
    if request.method == 'GET':
        try:
            fecha_inicio = request.args.get('fecha_inicio')
            fecha_fin = request.args.get('fecha_fin')

            if len(fecha_inicio) == 0 or len(fecha_fin) == 0:
                resultado = generacion_reporte()
                return "Reporte Generado exitosamente!"
            else:
                resultado = generacion_reporte(fecha_inicio, fecha_fin)
                return "Reporte Generado exitosamente!"

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
                return "Reporte Generado exitosamente 200!"
            else:
                resultado = generacion_reporte_usuario(fecha_inicio, fecha_fin, rol, id_user)
                return "Reporte Generado exitosamente 300!"

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
        servicio = request.form['servicio']

        puestos_ocupados = obtener_puestos_ocupados(servicio)
        puestos_libres = obtener_puesto_vacante(puestos_ocupados)

        usuario_existente = Usuario.query.filter_by(username = username).first()

        if usuario_existente:
            flash("El nombre de Usuario ya existe")
            return redirect(url_for('user.user_create'))
        else:
            if rol == "Ventanilla":
                if puestos_libres == 0:
                    ventanillas = consultar_numero_ventanillas(servicio) + 1
                else:
                    ventanillas = puestos_libres

                if servicio == "Recaudaciones":

                    puesto = "VCJ" + str(ventanillas)


                elif servicio == "Cambios de domicilio":

                    puesto = "VCD" + str(ventanillas)

                else:

                    puesto = "VJF" + str(ventanillas)


            nuevo_usuario = Usuario(id = nuevo_id, username = username, nombre = nombre, apellido = apellido, rol = rol, puesto = puesto, servicio = servicio)

            nuevo_usuario.set_password(password)

            db.session.add(nuevo_usuario)
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
        servicio = request.form['servicio']

        

        puestos_ocupados = obtener_puestos_ocupados(servicio)
        puestos_libres = obtener_puesto_vacante(puestos_ocupados)

        usuario_modificar = Usuario.query.filter_by(id = id).first()
        print(rol)
        print(servicio)
        print(usuario_modificar.servicio)

        usuario_modificar.nombre = nombre
        usuario_modificar.apellido = apellido
        usuario_modificar.username = username
        usuario_modificar.rol = rol

        if rol == "Ventanilla" and usuario_modificar.servicio != servicio:
            if puestos_libres == 0:
                ventanillas = consultar_numero_ventanillas(servicio) + 1
            else:
                ventanillas = puestos_libres

            if servicio == "Recaudaciones":

                puesto_nuevo = "VCJ" + str(ventanillas)
                usuario_modificar.puesto = puesto_nuevo
                usuario_modificar.servicio = servicio

            elif servicio == "Cambios de domicilio":

                puesto_nuevo = "VCD" + str(ventanillas)
                usuario_modificar.puesto = puesto_nuevo
                usuario_modificar.servicio = servicio

            else:

                puesto_nuevo = "VJF" + str(ventanillas)
                usuario_modificar.puesto = puesto_nuevo
                usuario_modificar.servicio = servicio


        db.session.commit()
        flash("El Usuario fue modificado correctamente", 'success')
        return redirect(url_for('user.user_management'))

@api_bp.route('/resetear_usuario', methods=['POST'])
def resetear_usuario():
    if request.method == 'POST':
        id = request.form['id']
        password = request.form['password']
        repeat_password = request.form['repeat-password']

        if password != repeat_password:
            flash("Las contraseñas no coinciden!", 'error')
            return redirect(url_for('user.user_reset', id_user = id))
        else:

            usuario_modificar = Usuario.query.filter_by(id = id).first()
            usuario_modificar.cambiar_password(password)

            flash("La contraseña fue reseteada correctamente", 'success')
            return redirect(url_for('user.user_management'))

@api_bp.route('/actualizar_tabla', methods=['GET'])
def actualizar_tabla():
    puesto = request.args.get('id_user')
    puesto_servicio = puesto[0:3]
    turnos = consultar_tabla(2)
    turnos_serial = []

    if puesto_servicio == "VCD":
        for turno in turnos:
            if turno.id_servicio == 1:
                turnos_serial.append(turno.to_dict())
    elif puesto_servicio == "VJF":
        for turno in turnos:
            if turno.id_servicio == 2:
                turnos_serial.append(turno.to_dict())
    elif puesto_servicio == "VCJ":
        for turno in turnos:
            if turno.id_servicio == 3:
                turnos_serial.append(turno.to_dict())


    respuesta = {
        'turnos': turnos_serial,
        'pendiente': False,
        'puesto' : puesto
    }

    asignados = Turnos.query.filter_by(estado_turno = "Asignado").all()

    for asignado in asignados:
        if str(asignado.puesto) == puesto:
            respuesta = {
                'turnos': turnos_serial,
                'pendiente': True,
                'puesto' : puesto
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
    liberar_turno(data['puestoId'], data['n_formulario_valor'])
    resultado = asignar_turno(data['puestoId'])








