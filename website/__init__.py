from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_apscheduler import APScheduler
from flask_cors import CORS

db = SQLAlchemy()
socketio = SocketIO()
scheduler = APScheduler()


def create_app():

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
    from .API.auth_control import api_auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(api_auth, url_prefix='/api')

    return app, socketio
