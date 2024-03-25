from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_apscheduler import APScheduler
from flask_cors import CORS
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()
socketio = SocketIO()
scheduler = APScheduler()


def create_app():

    app = Flask(__name__)
    CORS(app, origins='*')
    app.config['SECRET_KEY'] = 'FValdez181222'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456789@localhost/turnos?charset=utf8mb4&collation=utf8mb4_bin'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['DEBUG'] = True
    app.config['ENV'] = 'development'

    login_manager.init_app(app)
    db.init_app(app)  # Inicializa SQLAlchemy con la aplicación
    socketio.init_app(app)

    from .views import views
    from .auth import auth
    from .user import user
    from .API.api_route import api_bp

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(user, url_prefix='/')
    app.register_blueprint(api_bp, url_prefix='/api')

    return app, socketio
