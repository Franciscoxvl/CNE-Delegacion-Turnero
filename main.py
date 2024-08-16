import eventlet
eventlet.monkey_patch()
import threading
from website import create_app
from website.API.api_route import consultar_turno 
from website.auth import status_401, status_404
import logging


app, socketio_app, db = create_app()
stop_event = threading.Event()

# log_dir = "/app/logs"
# os.makedirs(log_dir, exist_ok=True)

def run_consultar_turno():
    while not stop_event.is_set():
        if not getattr(app, 'is_shutting_down', False):
            estado_turnos = consultar_turno(app)
            socketio_app.emit('turno_espera', estado_turnos)
        # Esperar 2 segundos antes de la próxima consulta
        stop_event.wait(2)

def stop_consultar_turno():
    stop_event.set()

if __name__ == '__main__':
    try:
        consulta_turno_thread = threading.Thread(target=run_consultar_turno)
        consulta_turno_thread.start()
        app.register_error_handler(401, status_401)
        app.register_error_handler(404, status_404)
        
        with app.app_context():
            db.create_all()

        socketio_app.run(app, host='127.0.0.1', port=8000, debug=True, use_reloader=False)
    finally:
        stop_consultar_turno()