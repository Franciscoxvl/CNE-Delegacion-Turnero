from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_apscheduler import APScheduler
from flask_cors import CORS

db = SQLAlchemy()
socketio = SocketIO()
scheduler = APScheduler()


def create_app():
    from .API.api_route import consultar_turno

    app = Flask(__name__)
    CORS(app, origins='*')
    app.config['SECRET_KEY'] = 'AUTHORIZATION'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456789@localhost/turnos'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)  # Inicializa SQLAlchemy con la aplicación
    socketio.init_app(app)

    from .views import views
    from .auth import auth
    from .API.api_route import api_bp

    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    return app, socketio
