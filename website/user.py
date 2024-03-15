from flask import Blueprint, render_template
from flask import flash, redirect, render_template, request, url_for

user = Blueprint('user', __name__)

@user.route('/profile')
def profile():
    return render_template("base.html")