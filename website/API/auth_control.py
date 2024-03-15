from . import api_auth

def verificar():
    print("Hola mundo ")


@api_auth.route('/auth-api')
def principal():

    from website.models import Usuario, db

    Usuario = Usuario.query.filter_by(username='admin').first()
    verificacion = Usuario.check_password("admin-password")
    print(verificacion)

    return "<h1> Pagina Authentication</h1>"