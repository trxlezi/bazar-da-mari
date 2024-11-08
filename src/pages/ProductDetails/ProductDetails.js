import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';

function ProductDetails({ setCart }) {
    const { id } = useParams();  // Obtém o id do produto da URL
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const products = [
            { id: 1, name: 'Camisa Polo', price: 50, description: 'Camisa confortável e estilosa' },
            { id: 2, name: 'Calça Jeans', price: 100, description: 'Calça jeans de corte reto' },
            { id: 3, name: 'Tênis Casual', price: 150, description: 'Tênis para uso diário' },
        ];

        const productFound = products.find(product => product.id === parseInt(id));
        setProduct(productFound);
    }, [id]);

    if (!product) {
        return <p>Produto não encontrado.</p>;
    }

    const handleAddToCart = () => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    return (
        <div className="product-details">
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Preço: R$ {product.price}</p>
            <button onClick={handleAddToCart}>Adicionar ao Carrinho</button>
        </div>
    );
}

export default ProductDetails;
