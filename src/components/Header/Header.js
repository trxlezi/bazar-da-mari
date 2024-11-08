import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegação
import './Header.css';
import logo from '../../assets/logo.png'; // Caminho do logo

function Header() {
    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="Logo Bazar da Mari" className="logo" />
                </Link>
            </div>
            <nav className="nav-links">
                {/* Corrigir os links para corresponder às rotas configuradas */}
                <Link to="/produtos/camisas">Camisas</Link>
                <Link to="/produtos/calcas">Calças</Link>
                <Link to="/produtos/ongs">Produtos para ONGs</Link>
                <Link to="/carrinho">Carrinho</Link>
            </nav>
        </header>
    );
}

export default Header;
