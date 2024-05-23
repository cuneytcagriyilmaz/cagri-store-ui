import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosInstance';
import './UserProduct.css';

const UserProduct = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [userId, setUserId] = useState(null);

    const wrapperRef = useRef(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchUserId();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                // Eğer bir ürün seçiliyse, seçimi kaldır
                setSelectedProduct(null);
                // Image preview'i temizle
                setImagePreview(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const fetchProducts = async (query = '') => {
        const endpoint = query ? `/customer/search/${query}` : '/customer/product';
        try {
            const response = await axiosInstance.get(endpoint);
            console.log('Fetched products:', response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/customer');
            const filteredCategories = response.data.filter((cat) => cat.categoryName);
            setCategories(filteredCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchUserId = async () => {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            try {
                const response = await axiosInstance.get(`http://localhost:9000/auth/auth/${userEmail}`);
                setUserId(response.data);
                console.log(userEmail);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        }
    };

    const handleSearch = () => {
        fetchProducts(searchTerm);
    };

    const handleAddToCart = async (productId) => {
        if (!userId) {
            return;
        }

        try {
            const response = await axiosInstance.post('/customer/cart', {
                userId: userId,
                productId: productId
            });
            console.log('Product added to cart:', response.data);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    return (
        <div>
            <div className="search-box">
                <input
                    type="text"
                    value={searchTerm || ''}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="product-container">
                {products.map(product => (
                    <div className="product-box" key={product.productId}>
                        <img
                            src={`data:image/jpeg;base64,${product.productByteImage}`}
                            alt={product.productName}
                            className="product-image"
                        />
                        <div className="product-details">
                            <h3>{product.productName}</h3>
                            <p>Price: ${product.productPrice}</p>
                            <p>Category: {product.categoryId}</p>
                        </div>
                        <button className="add-to-cart-button" onClick={() => handleAddToCart(product.productId)}>Add To Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserProduct;
