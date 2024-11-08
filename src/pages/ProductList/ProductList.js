// src/pages/ProductList/ProductList.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductList.css';
import ProductCard from '../../components/ProductCard/ProductCard';

function ProductList() {
    const { category } = useParams();
    const [filterName, setFilterName] = useState('');
    const [maxPrice, setMaxPrice] = useState(200); // Preço máximo

    const products = [
        { 
            id: 1, 
            name: 'Camisa Polo', 
            price: 50, 
            category: 'camisas', 
            description: 'Camisa confortável e estilosa',
            image: 'camisa_polo.jpg' // Imagem específica para este produto
        },
        { 
            id: 2, 
            name: 'Calça Jeans', 
            price: 80, 
            category: 'calcas', 
            description: 'Calça de alta qualidade',
            image: 'calca_jeans.jpg' // Imagem específica para este produto
        },
        { 
            id: 3, 
            name: 'Camiseta Básica', 
            price: 30, 
            category: 'camisas', 
            description: 'Camiseta simples e elegante',
            image: 'camiseta_basica.jpg' // Imagem específica para este produto
        },
        { 
            id: 4, 
            name: 'Blusa de Frio', 
            price: 120, 
            category: 'camisas', 
            description: 'Blusa quente para inverno',
            image: 'blusa_de_frio.jpg' // Imagem específica para este produto
        },
    ];
    

    const filteredProducts = products.filter(product => {
        // Filtra por categoria
        if (product.category !== category) return false;
        
        // Filtra por nome (caso o nome contenha o texto digitado)
        if (filterName && !product.name.toLowerCase().includes(filterName.toLowerCase())) return false;

        // Filtra por preço máximo
        if (product.price > maxPrice) return false;

        return true;
    });

    const handleFilterNameChange = (e) => {
        setFilterName(e.target.value);
    };

    const handlePriceRangeChange = (e) => {
        setMaxPrice(e.target.value);
    };

    return (
        <div className="product-list-container">
            <div className="filter-container">
                <input 
                    type="text" 
                    placeholder="Filtrar por nome"
                    value={filterName} 
                    onChange={handleFilterNameChange} 
                />

                <div className="price-filter">
                    <label>Preço máximo: R$ {maxPrice}</label>
                    <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        value={maxPrice} 
                        onChange={handlePriceRangeChange} 
                        step="5"
                    />
                </div>
            </div>
            
            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>Sem produtos encontrados com os filtros aplicados.</p>
                )}
            </div>
        </div>
    );
}

export default ProductList;
