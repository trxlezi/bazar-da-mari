import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

function LoginForm({ setIsLoggedIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            console.log('Full response:', response);
            console.log('Full response data:', response.data);

            if (response.data && response.data.access_token) {
                const { access_token } = response.data;
                console.log('Received token:', access_token);

                // Salva o token no localStorage
                localStorage.setItem('token', access_token);

                console.log('Stored token:', localStorage.getItem('token'));

                // Atualiza o estado de login
                setIsLoggedIn(true);
            } else {
                console.error('No access_token in response:', response.data);
                setError('Erro no formato da resposta do servidor.');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response);
            setError('Credenciais inválidas ou erro no servidor');
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

