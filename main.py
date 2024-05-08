import threading
from website import create_app, socketio
from website.API.api_route import consultar_turno
from website.auth import status_401, status_404

app, socketio = create_app()
stop_event = threading.Event()

def run_consultar_turno():
    while not stop_event.is_set():
        if not getattr(app, 'is_shutting_down', False):
            estado_turnos = consultar_turno(app)
            socketio.emit('turno_espera', estado_turnos)
        # Esperar 5 segundos antes de la próxima consulta
        stop_event.wait(2)

def stop_consultar_turno():
    stop_event.set()

if __name__ == '__main__':
    consulta_turno_thread = threading.Thread(target=run_consultar_turno)
    consulta_turno_thread.start()
    
    app.register_error_handler(401, status_401)
    app.register_error_handler(404, status_404)
    
    try:
        socketio.run(app, host='0.0.0.0', debug=True, use_reloader=False)
    finally:
        stop_consultar_turno()
