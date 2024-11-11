import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

function ProductDetails({ cart, setCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/produto/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error("Erro ao buscar produto:", error));
    }, [id]);

    const addToCart = () => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Se o produto já estiver no carrinho, incrementa a quantidade
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Se o produto não estiver no carrinho, adiciona com quantity = 1
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    return (
        <div className="product-details">
            {product ? (
                <>
                    <h2>{product.name}</h2>
                    <p>Preço: R$ {product.price.toFixed(2)}</p>
                    <button onClick={addToCart}>Adicionar ao carrinho</button>
                </>
            ) : (
                <p>Carregando produto...</p>
            )}
        </div>
    );
}

export default ProductDetails;
