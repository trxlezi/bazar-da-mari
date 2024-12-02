import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import ProductManager from '../../components/ProductManager/ProductManager';

const ProductAdmin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div>
            {isLoggedIn ? (
                <ProductManager />
            ) : (
                <LoginForm setIsLoggedIn={setIsLoggedIn} />
            )}
        </div>
    );
};

export default ProductAdmin;
