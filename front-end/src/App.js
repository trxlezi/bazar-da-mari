import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import ProductList from './pages/ProductList/ProductList';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart/Cart';
import ProductAdmin from './pages/ProductAdmin/ProductAdmin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [cart, setCart] = useState(() => {
        // Carregar carrinho do localStorage ao inicializar
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/produtos/:category" element={<ProductList />} />
                    <Route path="/produto/:id" element={<ProductDetails setCart={setCart} />} />
                    <Route path="/admin" element={<ProductAdmin />} />
                    <Route path="/carrinho" element={<Cart cart={cart} setCart={setCart} />} />
                </Routes>
                <Footer />
                <ToastContainer position="bottom-right" autoClose={3000} />
            </div>
        </Router>
    );
}

export default App;
