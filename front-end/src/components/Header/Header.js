import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.png';

function Header() {
    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="Logo Bazar da Mari" className="logo" />
                </Link>
            </div>
            <nav className="nav-links">
                <Link to="/produtos/superiores">Superiores</Link>
                <Link to="/produtos/inferiores">Inferiores</Link>
                <Link to="/produtos/ongs">Produtos para ONGs</Link>
                <Link to="/carrinho">Carrinho</Link>
            </nav>
        </header>
    );
}

export default Header;
