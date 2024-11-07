// src/pages/ProductDetails/ProductDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';

function ProductDetails() {
    const { id } = useParams();  // Obtendo o id do produto da URL

    // Simulação de dados de produtos (substitua com dados reais de uma API ou banco de dados)
    const product = {
        1: { name: 'Camisa Polo', price: 50, description: 'Camisa confortável e estilosa' },
        2: { name: 'Calça Jeans', price: 80, description: 'Calça de alta qualidade' },
        3: { name: 'Camiseta Básica', price: 30, description: 'Camiseta simples e elegante' },
    };

    const selectedProduct = product[id];

    if (!selectedProduct) {
        return <div>Produto não encontrado.</div>;
    }

    return (
        <div className="product-details">
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <p>{`Preço: R$ ${selectedProduct.price}`}</p>
            <button>Adicionar ao Carrinho</button>
        </div>
    );
}

export default ProductDetails;
