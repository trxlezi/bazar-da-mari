import React from 'react';
import './Header.css';
import logo from '../../assets/logo.png'

function Header() {
    return (
        <header className="header">
            <img src={logo} alt="Logo Bazar da Mari" className="logo" />    </header>
    );
}

export default Header;