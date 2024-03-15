import threading
from website import create_app, socketio
from website.API.api_route import consultar_turno
from threading import Timer

app, socketio = create_app()
stop_event = threading.Event()

def run_consultar_turno():
    if not getattr(app, 'is_shutting_down', False):
        estado_turnos = consultar_turno(app)
        socketio.emit('turno_espera', estado_turnos)
        Timer(5, run_consultar_turno).start()

def stop_consultar_turno():
    stop_event.set()

if __name__ == '__main__':
    run_consultar_turno()
    socketio.run(app, host='10.0.17.68', port=5000, debug=True, use_reloader=False)
    stop_consultar_turno()  # Llamada para detener el hilo al apagar el servidor
