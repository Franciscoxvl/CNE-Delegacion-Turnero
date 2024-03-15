from flask import Blueprint, render_template, render_template
from flask_login import  login_required

user = Blueprint('user', __name__)

@user.route('/profile')
@login_required
def profile():
    return render_template("base.html")