from flask import Blueprint, request, session, render_template, flash, redirect, url_for
from flask_login import login_user, logout_user

from dethpad.models import db, User
from dethpad.forms import RegisterForm, LogInForm

import sys

auth = Blueprint('auth', __name__)


@auth.route('/register', methods=['GET', 'POST'])
def register():

    register_form = RegisterForm()

    with open('/var/www/log.txt', 'w') as f:
        sys.stdout = f
        print(session['csrf_token'], register_form.validate_on_submit(), register_form.errors, register_form.username.data, register_form.password.data, register_form.repeat.data)

    if (request.method == "POST" and
          register_form.username.data and len(register_form.username.data) > 0
      and register_form.password.data and len(register_form.password.data) > 7
      and register_form.repeat.data
      and register_form.repeat.data == register_form.password.data):

#    if register_form.validate_on_submit():
        if User.query.filter_by(username=register_form.username.data).first() is None:
            account = User(register_form.username.data, register_form.password.data)
            db.session.add(account)
            db.session.commit()
            flash('Account created!', 'success')
            return redirect(url_for('auth.login'))
        else:
            flash('Username taken!', 'danger')
    elif request.method == 'POST':
        flash('Account creation failed!', 'danger')

    return render_template('register.html', form=register_form)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    login_form = LogInForm()

    if (request.method == "POST" and
          login_form.username.data and len(login_form.username.data) > 0
      and login_form.password.data and len(login_form.password.data) > 7):

#    if login_form.validate_on_submit():

        user = User.query.filter_by(username=login_form.username.data).first()
        if user is None:
            flash('Username does not exist!', 'warning')
        elif user.password != login_form.password.data:
            flash('Incorrect password!', 'danger')
        else:
            login_user(user, force = True, remember = True)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('root'))
    elif request.method == 'POST':
        flash('Authentication failed!', 'danger')

    return render_template('login.html', form=login_form)


@auth.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    logout_user()
    flash('Logged out successfully', 'success')
    return redirect(url_for('root'))
