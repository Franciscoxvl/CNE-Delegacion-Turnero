from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Servicios(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(10), unique=True, nullable=False)
    descripcion = db.Column(db.String(255), nullable=False)

class Turnos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_servicio = db.Column(db.Integer, db.ForeignKey('servicios.id'), nullable=False)
    puesto = db.Column(db.String(10), db.ForeignKey('usuario.id'), nullable=False)
    usuario = db.Column(db.String(50), nullable=False)
    numero_turno = db.Column(db.String(10), nullable=False)
    numero_formulario = db.Column(db.String(50))
    fecha = db.Column(db.Date, nullable=False)
    estado_turno = db.Column(db.String(20), nullable=False)

    servicio = db.relationship('Servicios', backref='turnos')

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
    id_turno = db.Column(db.String(10), nullable=False) 
    id_servicio = db.Column(db.Integer, db.ForeignKey('servicios.id'), nullable=False)
    fecha_solicitud = db.Column(db.Date, nullable=False)
    codigo_turno = db.Column(db.String(15), nullable=False)

    servicio = db.relationship('Servicios', backref='espera')

    def to_dict(self):
        return {
            'id': self.id,
            'id_turno': self.id_turno,
            'servicio': self.servicio.descripcion,
            'fecha_solicitud': self.fecha_solicitud.isoformat(),
            'codigo_turno': self.codigo_turno  
        }

class Usuario(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    rol = db.Column(db.String(20), nullable=False)
    puesto = db.Column(db.String(80), nullable=False)
    servicio = db.Column(db.String(50), nullable=False)
    provincia = db.Column(db.String(50), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def cambiar_password(self, nuevo_password):
        self.set_password(nuevo_password)
        db.session.commit()


class Calificacion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ventanilla = db.Column(db.String(50), nullable=False)
    calificacion = db.Column(db.String(50), nullable=False)
    fecha = db.Column(db.Date, nullable=False)

