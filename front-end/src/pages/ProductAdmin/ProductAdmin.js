import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';  // Caminho correto
import ProductManager from '../../components/ProductManager/ProductManager';  // Certifique-se de importar o ProductManager

const ProductAdmin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div>
            {isLoggedIn ? (
                <ProductManager />  // Mostrar o gerenciador de produtos se estiver logado
            ) : (
                <LoginForm setIsLoggedIn={setIsLoggedIn} />  // Passando a função como prop
            )}
        </div>
    );
};

export default ProductAdmin;
