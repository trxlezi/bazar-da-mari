import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link do React Router
import './ProductCard.css';

function ProductCard({ product }) {
    return (
        <div className="product-card">
            <Link to={`/produto/${product.id}`} className="product-link">
                <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="product-image"
                />
                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p className="product-price">R$ {product.price}</p>
                    <p className="product-category">{product.category}</p>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;
