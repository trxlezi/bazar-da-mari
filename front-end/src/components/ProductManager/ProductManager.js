import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductManager.css';

function ProductManager() {
    const [superiores, setSuperiores] = useState([]);
    const [inferiores, setInferiores] = useState([]);
    const [ongs, setOngs] = useState([]);
    const [form, setForm] = useState({ id: '', name: '', price: '', category: '', description: '', image: null });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Não autenticado. Por favor, faça login.');
        } else {
            loadAllProducts();
        }
    }, []);

    const loadAllProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [superioresRes, inferioresRes, ongsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/superiores', { headers }),
                axios.get('http://localhost:5000/api/inferiores', { headers }),
                axios.get('http://localhost:5000/api/ongs', { headers }),
            ]);

            setSuperiores(superioresRes.data);
            setInferiores(inferioresRes.data);
            setOngs(ongsRes.data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error.response ? error.response.data : error.message);
        }
    };

    const addProduct = async () => {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('price', form.price);
        formData.append('description', form.description);
        formData.append('category', form.category);
        formData.append('image', form.image);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/${form.category}`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setForm({ id: '', name: '', price: '', category: '', description: '', image: null });
            loadAllProducts();
        } catch (error) {
            console.error("Erro ao adicionar produto:", error.response ? error.response.data : error.message);
        }
    };

    const updateProduct = async () => {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('price', form.price);
        formData.append('description', form.description);
        formData.append('image', form.image);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/produto/${form.id}`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setForm({ id: '', name: '', price: '', category: '', description: '', image: null });
            loadAllProducts();
            setEditMode(false);
        } catch (error) {
            console.error("Erro ao editar produto:", error.response ? error.response.data : error.message);
        }
    };

    const deleteProduct = async (id, category) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/product/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadAllProducts();
        } catch (error) {
            console.error("Erro ao excluir produto:", error.response ? error.response.data : error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            updateProduct();
        } else {
            addProduct();
        }
    };

    const handleEdit = (product) => {
        setForm({ ...product });
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setForm({ id: '', name: '', price: '', category: '', description: '', image: null });
        setEditMode(false);
    };

    const renderProducts = (products, category) => (
        <div className={`category-${category}`}>
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <ul className="product-list">
                {products.map(product => (
                    <li key={product.id} className="product-item">
                        <img 
                            src={`http://localhost:5000${product.image}`} 
                            alt={product.name} 
                            className="product-image" 
                        />
                        <div>
                            <h3>{product.name}</h3>
                            <p>R$ {product.price}</p>
                            <p>{product.description}</p>
                        </div>
                        <button onClick={() => handleEdit(product)}>Editar</button>
                        <button onClick={() => deleteProduct(product.id, category)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="product-manager">
            <h1>Gerenciar Produtos</h1>
            <form onSubmit={handleSubmit} className="product-form">
                <input 
                    type="text" 
                    placeholder="Nome" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Preço" 
                    value={form.price} 
                    onChange={e => setForm({ ...form, price: e.target.value })} 
                    required 
                />
                <select 
                    value={form.category} 
                    onChange={e => setForm({ ...form, category: e.target.value })} 
                    required
                >
                    <option value="" disabled>Selecione uma categoria</option>
                    <option value="superiores">Superiores</option>
                    <option value="inferiores">Inferiores</option>
                    <option value="ongs">ONGs</option>
                </select>
                <textarea 
                    placeholder="Descrição" 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                    required 
                />
                <input 
                    type="file" 
                    onChange={e => setForm({ ...form, image: e.target.files[0] })} 
                />
                <button type="submit">{editMode ? 'Atualizar Produto' : 'Adicionar Produto'}</button>
                {editMode && <button type="button" onClick={handleCancelEdit}>Cancelar</button>}
            </form>

            <div className="categories">
                {renderProducts(superiores, 'superiores')}
                {renderProducts(inferiores, 'inferiores')}
                {renderProducts(ongs, 'ongs')}
            </div>
        </div>
    );
}

export default ProductManager;
