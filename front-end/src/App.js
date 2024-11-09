import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import ProductList from './pages/ProductList/ProductList';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart/Cart';

function App() {
    const [cart, setCart] = useState([]);

    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/produtos/:category" element={<ProductList />} />
                    <Route path="/produto/:id" element={<ProductDetails setCart={setCart} />} />
                    <Route path="/carrinho" element={<Cart cart={cart} setCart={setCart} />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
