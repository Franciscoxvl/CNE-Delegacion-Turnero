from . import db
from sqlalchemy.sql import func

class Servicios(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(10), unique=True, nullable=False)
    descripcion = db.Column(db.String(255), nullable=False)  

class Puestos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    estado = db.Column(db.String(20), nullable=False)

class Turnos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_servicio = db.Column(db.Integer, db.ForeignKey('servicios.id'), nullable=False)
    id_puesto = db.Column(db.Integer, db.ForeignKey('puestos.id'), nullable=False)
    numero_turno = db.Column(db.String(10), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    estado_turno = db.Column(db.String(20), nullable=False)

    servicio = db.relationship('Servicios', backref='turnos')
    puesto = db.relationship('Puestos', backref='turnos')

class Espera(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_servicio = db.Column(db.Integer, db.ForeignKey('servicios.id'), nullable=False)
    fecha_solicitud = db.Column(db.Date, nullable=False)
    codigo_turno = db.Column(db.String(15), nullable=False)

    servicio = db.relationship('Servicios', backref='espera')