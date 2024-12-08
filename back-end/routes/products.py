from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from utils.helpers import allowed_file
from database import connect_db
from auth import token_required

products_bp = Blueprint('products', __name__)

def product_to_dict(product):
    return {
        'id': product[0],
        'name': product[1],
        'price': product[2],
        'description': product[3],
        'image': product[4]
    }

@products_bp.route('/api/<category>', methods=['GET'])
def get_products(category):
    if category not in ['superiores', 'inferiores', 'ongs']:
        return jsonify({"error": "Categoria inválida"}), 400

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {category}")
    products = cursor.fetchall()
    conn.close()
    return jsonify([product_to_dict(p) for p in products])

@products_bp.route('/api/<category>/<int:product_id>', methods=['GET'])
def get_product(category, product_id):
    if category not in ['superiores', 'inferiores', 'ongs']:
        return jsonify({"error": "Categoria inválida"}), 400

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {category} WHERE id = ?", (product_id,))
    product = cursor.fetchone()
    conn.close()

    if product:
        return jsonify(product_to_dict(product))
    else:
        return jsonify({"error": "Produto não encontrado"}), 404

@products_bp.route('/api/<category>', methods=['POST'])
@token_required
def create_product(category):
    if category not in ['superiores', 'inferiores', 'ongs']:
        return jsonify({"error": "Categoria inválida"}), 400

    data = request.form
    image_file = request.files.get('image')

    if image_file and allowed_file(image_file.filename):
        filename = secure_filename(image_file.filename)
        image_path = f"static/uploads/{filename}"
        image_file.save(image_path)
        image_url = f'/{image_path}'

        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute(
            f"INSERT INTO {category} (name, price, description, image) VALUES (?, ?, ?, ?)",
            (data['name'], data['price'], data['description'], image_url)
        )
        conn.commit()
        new_product_id = cursor.lastrowid
        conn.close()

        return jsonify({"id": new_product_id, "message": "Produto criado com sucesso"}), 201
    else:
        return jsonify({"error": "Arquivo de imagem inválido"}), 400

@products_bp.route('/api/product/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(product_id):
    # Listar as tabelas válidas
    valid_categories = ['superiores', 'inferiores', 'ongs']

    # Conectar ao banco de dados
    conn = connect_db()
    cursor = conn.cursor()

    # Verificar se o produto está presente em alguma das tabelas válidas
    product_deleted = False
    for category in valid_categories:
        cursor.execute(f"SELECT id FROM {category} WHERE id = ?", (product_id,))
        product = cursor.fetchone()
        if product:
            cursor.execute(f"DELETE FROM {category} WHERE id = ?", (product_id,))
            conn.commit()
            product_deleted = True
            break

    conn.close()

    if product_deleted:
        return jsonify({"message": "Produto excluído com sucesso!"}), 200
    else:
        return jsonify({"error": "Produto não encontrado em nenhuma categoria válida."}), 404
