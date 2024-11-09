import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductList.css';

function ProductList() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/produtos?category=${category}`)
            .then(response => setProducts(response.data))
            .catch(error => console.error("Erro ao buscar produtos:", error));
    }, [category]);

    return (
        <div>
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default ProductList;