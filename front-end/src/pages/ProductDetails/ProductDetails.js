import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';  // Importa o toast
import './ProductDetails.css';

function ProductDetail({ setCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/produto/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error("Erro ao buscar produto:", error));
    }, [id]);

    const addToCart = () => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                // Se o produto já estiver no carrinho, incrementa a quantidade
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Se o produto não estiver no carrinho, adiciona como novo item com quantity 1
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });

        // Exibe o Toast de sucesso
        toast.success("Produto adicionado ao carrinho!", {
            position: "bottom-right",  // Posição do Toast
            autoClose: 3000,           // Tempo de fechamento do Toast
        });
    };

    if (!product) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="product-detail">
            <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="product-detail-image"
            />
            <div className="product-detail-info">
                <h1>{product.name}</h1>
                <p className="product-detail-price">R$ {product.price}</p>
                <p className="product-detail-description">{product.description}</p>
                <div className="action-buttons">
                    <button onClick={addToCart} className="add-to-cart-button">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
