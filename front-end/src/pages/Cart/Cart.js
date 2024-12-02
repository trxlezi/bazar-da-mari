import React from 'react';
import './Cart.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cart({ cart, setCart }) {
    const removeFromCart = (productId) => {
        setCart(prevCart =>
            prevCart
                .map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        toast.success("Compra confirmada!", {
            position: 'top-center',
            autoClose: 3000,
        });
    };

    return (
        <div className="cart-container">
            <h1>Carrinho</h1>
            <div className="cart-total">
                <h2>Total do Pedido: R$ {total.toFixed(2)}</h2>
            </div>
            <ul className="cart-items">
                {cart.map(item => (
                    <li key={item.id} className="cart-item">
                        <div className="cart-item-details">
                            <span className="cart-item-name">{item.name}</span>
                            <span className="cart-item-price">R$ {item.price.toFixed(2)} x {item.quantity}</span>
                        </div>
                        <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                            Remover
                        </button>
                    </li>
                ))}
            </ul>

            <button className="checkout-button" onClick={handleCheckout}>
                Comprar Agora
            </button>

            <ToastContainer />
        </div>
    );
}

export default Cart;
