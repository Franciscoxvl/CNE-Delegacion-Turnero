from . import db
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class Servicios(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(10), unique=True, nullable=False)
    descripcion = db.Column(db.String(255), nullable=False)  

class Puestos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(50), unique=True, nullable=False)
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

    def to_dict(self):
        return {
            'id': self.id,
            'id_servicio': self.id_servicio,
            'id_puesto': self.id_puesto,
            'numero_turno': self.numero_turno,
            'fecha': self.fecha.isoformat(),  # Convertir fecha a formato ISO para serialización JSON
            'estado_turno': self.estado_turno
            # Agregar más campos según sea necesario
        }

class Espera(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_servicio = db.Column(db.Integer, db.ForeignKey('servicios.id'), nullable=False)
    fecha_solicitud = db.Column(db.Date, nullable=False)
    codigo_turno = db.Column(db.String(15), nullable=False)

    servicio = db.relationship('Servicios', backref='espera')

class Usuario(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    rol = db.Column(db.String(20), nullable=False)
    puesto = db.Column(db.String(20), nullable=False)


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)