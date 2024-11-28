from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
from werkzeug.utils import secure_filename
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)

# Configurações para upload de arquivos
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = os.urandom(24)  # Chave secreta para JWT

# Função para verificar a extensão do arquivo
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Função para conectar ao banco de dados SQLite
def connect_db():
    conn = sqlite3.connect('database.db')  # Altere para o caminho do seu banco de dados
    conn.row_factory = sqlite3.Row  # Para retornar os resultados como dicionários
    return conn

# Função para converter um produto em dicionário
def product_to_dict(product):
    return {
        'id': product[0],
        'name': product[1],
        'price': product[2],
        'category': product[3],
        'description': product[4],
        'image': product[5]
    }

# Função para criar a tabela 'products'
def create_table():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            image TEXT
        )
    """)
    
    conn.commit()
    conn.close()

# Chame a função para criar a tabela ao iniciar o aplicativo
create_table()

# Usuário pré-registrado
USUARIO = {'username': 'admin', 'password': 'adminpassword'}

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == USUARIO['username'] and password == USUARIO['password']:
        token = jwt.encode({
            'user': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'access_token': token}), 200
    else:
        return jsonify({'error': 'Credenciais inválidas'}), 401
    
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token ausente!'}), 401

        try:
            data = jwt.decode(token.split()[1], app.config['SECRET_KEY'], algorithms=['HS256'])
        except:
            return jsonify({'error': 'Token inválido!'}), 401

        return f(*args, **kwargs)

    return decorated


@app.route('/api/protected', methods=['GET'])
@token_required
def protected():
    return jsonify({'message': 'Bem-vindo, você está autenticado!'})

# Rota para obter todos os produtos ou por categoria
@app.route('/api/produtos', methods=['GET'])
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

# Rota para obter um produto específico por ID
@app.route('/api/produto/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    product = cursor.fetchone()
    conn.close()
    
    if product:
        return jsonify(product_to_dict(product))  # Retorna o produto encontrado
    else:
        return jsonify({"error": "Produto não encontrado"}), 404  # Caso o produto não exista

# Rota para adicionar um novo produto
@app.route('/api/produto', methods=['POST'])
@token_required
def create_product():
    data = request.form
    image_file = request.files.get('image')

    if image_file and allowed_file(image_file.filename):
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
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

@app.route('/api/produto/<int:product_id>', methods=['PUT'])
@token_required
def update_product(product_id):
    data = request.form
    image_file = request.files.get('image')
    
    image_url = data['image']
    if image_file and allowed_file(image_file.filename):
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(image_path)
        image_url = f'/{image_path}'

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE products SET name = ?, price = ?, category = ?, description = ?, image = ? WHERE id = ?",
        (data['name'], data['price'], data['category'], data['description'], image_url, product_id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Produto atualizado com sucesso"})

@app.route('/api/produto/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(product_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Produto excluído com sucesso"})

# Cria a pasta uploads se ela não existir
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

if __name__ == '__main__':
    app.run(port=5000)
