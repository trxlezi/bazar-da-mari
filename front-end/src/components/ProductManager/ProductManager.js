import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductManager.css';

function ProductManager() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ id: '', name: '', price: '', category: '', description: '', image: null });
    const [editMode, setEditMode] = useState(false); // Controla o modo de edição

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/produtos');
            setProducts(response.data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
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
            await axios.post('http://localhost:5000/api/produto', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm({ name: '', price: '', category: '', description: '', image: null });
            loadProducts();
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
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
            await axios.put(`http://localhost:5000/api/produto/${form.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm({ id: '', name: '', price: '', category: '', description: '', image: null });
            loadProducts();
            setEditMode(false);
        } catch (error) {
            console.error("Erro ao editar produto:", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/produto/${id}`);
            loadProducts();
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
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
                <input 
                    type="text" 
                    placeholder="Categoria" 
                    value={form.category} 
                    onChange={e => setForm({ ...form, category: e.target.value })} 
                    required 
                />
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