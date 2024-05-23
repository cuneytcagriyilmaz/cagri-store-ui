import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import './CartProduct.css';

const CartProduct = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchCartItems();
        fetchUserId();
    }, []);

    const fetchCartItems = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                const response = await axiosInstance.get(`http://localhost:9000/auth/auth/${userEmail}`);
                const userId = response.data;
                if (userId) {
                    const cartResponse = await axiosInstance.get(`http://localhost:9000/api/customer/cart/${userId}`);
                    setCartItems(cartResponse.data.cartItems);
                }
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const fetchUserId = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                const response = await axiosInstance.get(`http://localhost:9000/auth/auth/${userEmail}`);
                setUserId(response.data);
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const handleQuantityChange = (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleRemoveFromCart = async (cartItemId) => {
        try {
            await axiosInstance.delete(`http://localhost:9000/api/customer/cart/${userId}/item/${cartItemId}`);
            setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleOrder = async () => {
        try {
            const orderData = {
                userId: userId,
                address: address,
                orderDescription: description
            };
            await axiosInstance.post(`http://localhost:9000/api/customer/placedOrder`, orderData);
  
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div>
            <div className="cart-container">
                {cartItems.map(item => (
                    <div className="cart-item" key={item.cartItemId}>
                        <img className="product-image" src={`data:image/jpeg;base64,${item.catItemImg}`} alt={item.productName} />
                        <div className="product-details">
                            <h3>{item.productName}</h3>
                            <p>Price: ${item.price * item.quantity}</p>
                        </div>
                        <div className="quantity">
                            <button className="quantity-button" onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}>-</button>
                            <span className="quantity-display">{item.quantity}</span>
                            <button className="quantity-button" onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}>+</button>
                            <button className="remove-button" onClick={() => handleRemoveFromCart(item.cartItemId)}>Remove</button>
                        </div>
                    </div>
                ))}
                <div className="total-price">
                    Total Price: ${totalPrice}
                </div>
                <div className="order-details">
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button className="order-button" onClick={handleOrder}>Order</button>
            </div>
        </div>
    );
};

export default CartProduct;
