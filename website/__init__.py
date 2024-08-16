from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_apscheduler import APScheduler
from flask_cors import CORS
from flask_login import LoginManager
from .models import db
import logging
import os

# Configuración de la base de datos
login_manager = LoginManager()
scheduler = APScheduler()
socketio = SocketIO() 

def create_app():

    app = Flask(__name__)
    app.logger.setLevel(logging.DEBUG)
    CORS(app, origins='*')

    UPLOAD_FOLDER = 'website/static/uploads'
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    app.config['SECRET_KEY'] = 'FValdez181222'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///turnero.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['FLASKS_SERVE_STATIC_FILES'] = True
    app.config['DEBUG'] = True
    app.config['ENV'] = 'development'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = 800 * 1024 * 1024
    

    # Inicialización de extensiones
    login_manager.init_app(app)
    db.init_app(app)
    socketio.init_app(app, cors_allowed_origins='*')

    # Registro de blueprints
    from .views import views
    from .auth import auth
    from .user import user
    from .API.api_route import api_bp

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(user, url_prefix='/')
    app.register_blueprint(api_bp, url_prefix='/api')

    return app, socketio, db  # Return both app and socketio object
