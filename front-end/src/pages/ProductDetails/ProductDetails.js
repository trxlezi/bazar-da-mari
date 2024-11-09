import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

function ProductDetails({ setCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/produto/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error("Erro ao buscar produto:", error));
    }, [id]);

    const addToCart = () => {
        setCart(prevCart => [...prevCart, product]);
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