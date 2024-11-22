from flask import Flask, jsonify, request, session
from flask_cors import CORS
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configurações para upload de arquivos
UPLOAD_FOLDER = 'static/uploads'  # Pasta onde as imagens serão armazenadas
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)  # Chave secreta para sessões

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

# Rota de login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == USUARIO['username'] and password == USUARIO['password']:
        # Armazenando a autenticação na sessão
        session['logged_in'] = True
        return jsonify({'message': 'Login bem-sucedido'}), 200
    else:
        return jsonify({'error': 'Credenciais inválidas'}), 401

# Rota para verificar se o usuário está logado
@app.route('/api/protected', methods=['GET'])
def protected():
    if 'logged_in' not in session or not session['logged_in']:
        return jsonify({'error': 'Acesso negado. Usuário não autenticado'}), 401
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
def create_product():
    if 'logged_in' not in session or not session['logged_in']:
        return jsonify({'error': 'Acesso negado. Usuário não autenticado'}), 401

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

# Rota para atualizar um produto existente
@app.route('/api/produto/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    if 'logged_in' not in session or not session['logged_in']:
        return jsonify({'error': 'Acesso negado. Usuário não autenticado'}), 401

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

# Rota para excluir um produto
@app.route('/api/produto/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    if 'logged_in' not in session or not session['logged_in']:
        return jsonify({'error': 'Acesso negado. Usuário não autenticado'}), 401

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
