// src/pages/ProductList/ProductList.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductList.css';
import ProductCard from '../../components/ProductCard/ProductCard';

function ProductList() {
    const { category } = useParams();
    const [filterName, setFilterName] = useState('');
    const [priceRange, setPriceRange] = useState([0, 200]); // Intervalo de preço [minPrice, maxPrice]

    const products = [
        { id: 1, name: 'Camisa Polo', price: 50, category: 'camisas', description: 'Camisa confortável e estilosa' },
        { id: 2, name: 'Calça Jeans', price: 80, category: 'calcas', description: 'Calça de alta qualidade' },
        { id: 3, name: 'Camiseta Básica', price: 30, category: 'camisas', description: 'Camiseta simples e elegante' },
        { id: 4, name: 'Blusa de Frio', price: 120, category: 'camisas', description: 'Blusa quente para inverno' },
    ];

    const filteredProducts = products.filter(product => {
        // Filtra por categoria
        if (product.category !== category) return false;
        
        // Filtra por nome (caso o nome contenha o texto digitado)
        if (filterName && !product.name.toLowerCase().includes(filterName.toLowerCase())) return false;

        // Filtra por preço mínimo e máximo
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

        return true;
    });

    const handleFilterNameChange = (e) => {
        setFilterName(e.target.value);
    };

    const handlePriceRangeChange = (e) => {
        const newRange = [...priceRange];
        if (e.target.name === 'minPrice') {
            newRange[0] = e.target.value;
        } else {
            newRange[1] = e.target.value;
        }
        setPriceRange(newRange);
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
                    <label>Preço: R$ {priceRange[0]} - R$ {priceRange[1]}</label>
                    <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        value={priceRange[0]} 
                        onChange={handlePriceRangeChange} 
                        name="minPrice" 
                        step="5"
                    />
                    <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        value={priceRange[1]} 
                        onChange={handlePriceRangeChange} 
                        name="maxPrice" 
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
