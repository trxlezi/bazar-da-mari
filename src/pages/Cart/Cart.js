import React from 'react';
import './Cart.css';

function Cart({ cart, setCart }) {
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const increaseQuantity = (productId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (productId) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity }
                    : item
            );
            return updatedCart.filter(item => item.quantity > 0); // Remover item se quantidade for 0
        });
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="cart-container">
            <h1>Carrinho</h1>
            {cart.length === 0 ? (
                <p>Carrinho vazio</p>
            ) : (
                <ul>
                    {cart.map(item => (
                        <li key={item.id}>
                            <p>{item.name} - R$ {item.price} x {item.quantity}</p>
                            <button onClick={() => increaseQuantity(item.id)}>Adicionar mais</button>
                            <button onClick={() => decreaseQuantity(item.id)}>Remover uma peça</button>
                            <button onClick={() => removeFromCart(item.id)}>Remover do carrinho</button>
                        </li>
                    ))}
                </ul>
            )}

            {cart.length > 0 && (
                <div className="total-container">
                    <p><strong>Preço Total: R$ {calculateTotal()}</strong></p>
                    <button className="checkout-button">Comprar</button>
                </div>
            )}
        </div>
    );
}

export default Cart;
