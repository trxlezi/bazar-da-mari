import React, { useEffect } from 'react';
import './Cart.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cart({ cart, setCart }) {
    // Atualizar o localStorage sempre que o carrinho for alterado
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Função para remover itens do carrinho
    const removeFromCart = (productId) => {
        setCart(prevCart =>
            prevCart
                .map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    // Função para esvaziar o carrinho
    const clearCart = () => {
        setCart([]);
        toast.info("Carrinho esvaziado!", {
            position: 'top-center',
            autoClose: 3000,
        });
    };

    // Total do carrinho
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Função para finalizar a compra
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
            <button className="clear-cart-button" onClick={clearCart}>
                Esvaziar Carrinho
            </button>

            <ToastContainer />
        </div>
    );
}

export default Cart;
