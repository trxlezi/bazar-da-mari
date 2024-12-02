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
        'category': product[3],
        'description': product[4],
        'image': product[5]
    }

@products_bp.route('/api/produtos', methods=['GET'])
def get_products():
    category = request.args.get('category')
    conn = connect_db()
    cursor = conn.cursor()

    if category:
        cursor.execute("SELECT * FROM products WHERE category = ?", (category,))
    else:
        cursor.execute("SELECT * FROM products")

    products = cursor.fetchall()
    conn.close()
    return jsonify([product_to_dict(p) for p in products])

@products_bp.route('/api/produto/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    product = cursor.fetchone()
    conn.close()

    if product:
        return jsonify(product_to_dict(product))
    else:
        return jsonify({"error": "Produto não encontrado"}), 404

@products_bp.route('/api/produto', methods=['POST'])
@token_required
def create_product():
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
            "INSERT INTO products (name, price, category, description, image) VALUES (?, ?, ?, ?, ?)",
            (data['name'], data['price'], data['category'], data['description'], image_url)
        )
        conn.commit()
        new_product_id = cursor.lastrowid
        conn.close()

        return jsonify({"id": new_product_id, "message": "Produto criado com sucesso"}), 201
    else:
        return jsonify({"error": "Arquivo de imagem inválido"}), 400
