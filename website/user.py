from flask import Blueprint, render_template, render_template
from flask_login import  login_required, current_user

user = Blueprint('user', __name__)

@user.route('/profile')
@login_required
def profile():
    print(current_user.is_authenticated)
    return render_template("admin.html")