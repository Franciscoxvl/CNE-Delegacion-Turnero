from flask import jsonify, request
from . import api_bp
from website import socketio
from datetime import datetime

def cantidad_turnos(id_servicio):
    from website.models import Turnos, Espera
    cantidad_turnos_asignados = Turnos.query.filter_by(id_servicio=id_servicio).count()
    cantidad_turnos_espera = Espera.query.filter_by(id_servicio=id_servicio).count()
    cantidad_turnos = cantidad_turnos_asignados + cantidad_turnos_espera

    if cantidad_turnos == 0:
        cantidad_turnos = 1
    else:
        cantidad_turnos +=1

    return cantidad_turnos

def asignar_turno(id):
    from website.models import Turnos, Espera, db, Puestos, Servicios
    print("Asignando turno al puesto: ", id)
    puesto = Puestos.query.get(id)
    puesto.estado = "Libre"
    db.session.commit()

    if Espera.query.count() == 0:
        print("La tabla esta vacia, no hay turnos pendientes")
    else:
        #Asignacion de valores al nuevo turno
        nuevo_turno = Espera.query.first()
        id_servicio = nuevo_turno.id_servicio
        id_puesto = id
        numero_turno = Turnos.query.filter_by(id_servicio=id_servicio).count() + 1
        fecha = nuevo_turno.fecha_solicitud
        estado_turno = 'Asignado'

        #Creacion del nuevo turno y guardarlo en la base de datos
        turno = Turnos(id_servicio=id_servicio, id_puesto = id_puesto, numero_turno=numero_turno, fecha=fecha, estado_turno=estado_turno)
        db.session.add(turno)
        db.session.commit()

        #Envio del mensaje al visualizador
        servicio = Servicios.query.all()
        mensaje_turnero = {'codigo':servicio[int(id_servicio) - 1].codigo, 'numero_turno':numero_turno, 'puesto':id_puesto}
        socketio.emit('turno_asignado', mensaje_turnero)

        #Cambiar el estado del puesto
        puesto = Puestos.query.get(id_puesto)
        puesto.estado = "Ocupado"
        db.session.commit()

        #Eliminar de la tabla espera
        db.session.delete(nuevo_turno)
        db.session.commit()

        print(nuevo_turno.codigo_turno + str(numero_turno))
    
    
@api_bp.route('/')
def principal():
    return "<h1> HOLA MUNDO </h1>"

@api_bp.route('/ejemplo')
def ejemplo():
    return "<h1> HOLA MUNDO COMO EJEMPLO</h1>"


@api_bp.route('/generar_turno_espera', methods=['GET'])
def generar_turno_espera():
    from website.models import Servicios, Espera, db

    try:
        id_servicio = request.args.get('servicio')
        servicio = Servicios.query.all()

        codigo  = servicio[int(id_servicio) - 1].codigo
        ahora = datetime.now()
        fecha_hora_actual = ahora.strftime("%Y-%m-%d %H:%M:%S")

        numero_turno = cantidad_turnos(id_servicio)
        nuevo_turno_espera = Espera(id_servicio=id_servicio, fecha_solicitud=fecha_hora_actual, codigo_turno=codigo)
        db.session.add(nuevo_turno_espera)
        db.session.commit()

        return codigo + str(numero_turno)
    
    except Exception as e:
        error = str(e)
        return error, 500
    
@socketio.on('connect')
def handle_connect():
    print('Cliente conectado.')

@socketio.on('liberar_puesto')
def handle_liberar_puesto(data):
    # Lógica para liberar el puesto y asignar un nuevo turno
    asignar_turno(data['puestoId'])


def consultar_turno(app):
    from website.models import Espera

    with app.app_context():
        try:
            turnos = Espera.query.count()
            if turnos == 0:
                return "No hay turnos pendientes"
            else:
                return "Hay turnos pendientes"
        except Exception as e:
            print(f"Error al consultar turnos: {str(e)}")

    


 
