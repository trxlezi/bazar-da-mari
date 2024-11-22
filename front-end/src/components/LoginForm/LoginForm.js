import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';  // Certifique-se de importar o arquivo CSS

function LoginForm({ setIsLoggedIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            const { access_token } = response.data;

            // Salva o token no localStorage
            localStorage.setItem('token', access_token);

            // Atualiza o estado de login diretamente
            setIsLoggedIn(true);

        } catch (error) {
            setError('Credenciais inválidas');
        }
    };

    return (
        <div className="login-form">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-btn">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
