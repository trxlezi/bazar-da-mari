from flask import Blueprint
from auth import login
from routes.products import products_bp

def init_routes(app):
    app.route('/api/login', methods=['POST'])(login)
    app.register_blueprint(products_bp)
