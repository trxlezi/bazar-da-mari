import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductManager.css';

function ProductManager() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ id: '', name: '', price: '', category: '', description: '', image: null });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Não autenticado. Por favor, faça login.');
        } else {
            loadProducts();
        }
    }, []);

    const loadProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token used for loading products:', token);

            const response = await axios.get('http://localhost:5000/api/produtos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                setError('Sessão expirada. Por favor, faça login novamente.');
            }
        }
    };

    const addProduct = async () => {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('price', form.price);
        formData.append('category', form.category);
        formData.append('description', form.description);
        formData.append('image', form.image);

        try {
            const token = localStorage.getItem('token');
            console.log('Token used for adding product:', token);

            const response = await axios.post('http://localhost:5000/api/produto', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log('Product added successfully:', response.data);
            setForm({ id: '', name: '', price: '', category: '', description: '', image: null });
            loadProducts();
        } catch (error) {
            console.error("Erro ao adicionar produto:", error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                setError('Sessão expirada. Por favor, faça login novamente.');
            }
        }
    };

    const updateProduct = async () => {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('price', form.price);
        formData.append('category', form.category);
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
            loadProducts();
            setEditMode(false);
        } catch (error) {
            console.error("Erro ao editar produto:", error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                setError('Sessão expirada. Por favor, faça login novamente.');
            }
        }
    };

    const deleteProduct = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/produto/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadProducts();
        } catch (error) {
            console.error("Erro ao excluir produto:", error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                setError('Sessão expirada. Por favor, faça login novamente.');
            }
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

            <h2>Lista de Produtos</h2>
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
                            <p>{product.category}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(product)}>Editar</button>
                            <button onClick={() => deleteProduct(product.id)}>Excluir</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductManager;

