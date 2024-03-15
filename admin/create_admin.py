import sys
import os

# Agrega la ruta del directorio raíz del proyecto al sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from website.models import Usuarios
from website import db
import json

with open(os.path.join(os.path.dirname(__file__), 'config.json'), 'r') as file:
        config = json.load(file)
        admin_data = config.get('admin')
        admin_user = Usuarios(username = admin_data['username'])
        admin_user.set_password(admin_data['password'])
        print(admin_user.username)
        print(admin_user.password_hash)



