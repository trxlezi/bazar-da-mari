from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Exemplo de dados de produtos (poderia vir de um banco de dados)
products = [        
        { 
            'id': 1, 
            'name': 'Camisa Polo', 
            'price': 50, 
            'category': 'camisas', 
            'description': 'Camisa confortável e estilosa',
            'image': 'camisa_polo.jpg'
        },
        { 
            'id': 2, 
            'name': 'Calça Jeans', 
            'price': 80, 
            'category': 'calcas', 
            'description': 'Calça de alta qualidade',
            'image': 'calca_jeans.jpg'
        },
        { 
            'id': 3, 
            'name': 'Camiseta Básica', 
            'price': 30, 
            'category': 'camisas', 
            'description': 'Camiseta simples e elegante',
            'image': 'camiseta_basica.jpg'
        },
        { 
            'id': 4, 
            'name': 'Blusa de Frio', 
            'price': 120, 
            'category': 'camisas', 
            'description': 'Blusa quente para inverno',
            'image': 'blusa_de_frio.jpg'
        },
        { 
            'id': 5, 
            'name': 'Sueter', 
            'price': 120, 
            'category': 'camisas', 
            'description': 'Sueter de lã',
            'image': 'blusa_de_frio.jpg'
        }]



@app.route('/api/produtos', methods=['GET'])
def get_products():
    category = request.args.get('category')
    filtered_products = [p for p in products if p['category'] == category] if category else products
    return jsonify(filtered_products)

@app.route('/api/produto/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    return jsonify(product) if product else ({"error": "Produto não encontrado"}, 404)

if __name__ == '__main__':
    app.run(port=5000)