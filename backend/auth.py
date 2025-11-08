# auth.py
import functools
import sqlite3
import os
from flask import (
    Blueprint, jsonify, request, session, g, redirect, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

DATABASE = os.path.join(os.getcwd(), 'backend.sqlite')


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# register
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    error = None

    if not username:
        error = "Username is required."
    elif not password:
        error = "Password is required."

    if error is not None:
        return jsonify({"error": error}), 400

    db = get_db()
    try:
        db.execute(
            "INSERT INTO user (username, password, created_at) VALUES (?, ?, ?)",
            (username, generate_password_hash(password), datetime.now()),
        )
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": f"User '{username}' already exists."}), 409

    return jsonify({"message": f"User '{username}' registered successfully!"}), 201


# login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    db = get_db()
    user = db.execute(
        'SELECT * FROM user WHERE username = ?', (username,)
    ).fetchone()

    if user is None:
        return jsonify({"error": "Incorrect username."}), 401
    elif not check_password_hash(user['password'], password):
        return jsonify({"error": "Incorrect password."}), 401

    session.clear()
    session['user_id'] = user['id']
    return jsonify({"message": f"Welcome back, {username}!"}), 200


#  Load user
@auth_bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()


# Logout
@auth_bp.route('/logout')
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully!"}), 200


# login
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return jsonify({"error": "Login required."}), 401
        return view(**kwargs)
    return wrapped_view
