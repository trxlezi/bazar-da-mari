// src/components/ProductCard/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
    const navigate = useNavigate();

    const goToProductDetails = () => {
        navigate(`/produto/${product.id}`);
    };

    return (
        <div className="product-card" onClick={goToProductDetails}>
            {/* Usando a chave 'image' para exibir a imagem do produto */}
            <img src={`../../assets/${product.image}`} alt={product.name} />
            <div className="product-info">
                <h3>{product.name}</h3>
                <p>{`R$ ${product.price}`}</p>
            </div>
        </div>
    );
}

export default ProductCard;
