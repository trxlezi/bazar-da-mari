// src/pages/Home/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();

    const navigateTo = (category) => {
        navigate(`/produtos/${category}`);
    };

    return (
        <main className="home-container">
            <section
                className="home-section camisas"
                onClick={() => navigateTo('camisas')}
            >
                <h2>Camisas</h2>
            </section>
            <section
                className="home-section calcas"
                onClick={() => navigateTo('calcas')}
            >
                <h2>Calças</h2>
            </section>
            <section
                className="home-section ongs"
                onClick={() => navigateTo('ongs')}
            >
                <h2>Produtos para ONGs</h2>
            </section>
        </main>
    );
}

export default Home;
