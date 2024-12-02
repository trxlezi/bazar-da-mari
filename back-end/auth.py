from flask import jsonify, request
import jwt
import datetime
from functools import wraps
from config import Config

USUARIO = {'username': 'admin', 'password': 'adminpassword'}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token ausente!'}), 401

        try:
            data = jwt.decode(token.split()[1], Config.SECRET_KEY, algorithms=['HS256'])
        except:
            return jsonify({'error': 'Token inválido!'}), 401

        return f(*args, **kwargs)

    return decorated

def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == USUARIO['username'] and password == USUARIO['password']:
        token = jwt.encode({
            'user': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm='HS256')

        return jsonify({'access_token': token}), 200
    else:
        return jsonify({'error': 'Credenciais inválidas'}), 401
