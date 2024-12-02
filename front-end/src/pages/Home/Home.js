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
                className="home-section superiores"
                onClick={() => navigateTo('superiores')}
            >
                <h2>Superiores</h2>
            </section>
            <section
                className="home-section inferiores"
                onClick={() => navigateTo('inferiores')}
            >
                <h2>Inferiores</h2>
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
