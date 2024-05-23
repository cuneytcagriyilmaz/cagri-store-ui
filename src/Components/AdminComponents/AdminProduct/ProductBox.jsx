import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductBox.css';

const ProductBox = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({
        productName: '',
        productPrice: '',
        productDescription: '',
        categoryId: '',
        productImage: null
    });
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    const wrapperRef = useRef(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSelectedProduct(null);
                setImagePreview(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const fetchProducts = async (query = '') => {
        const endpoint = query ? `/admin/search/${query}` : '/admin/product';
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
            const response = await axiosInstance.get('/admin');
            const filteredCategories = response.data.filter((cat) => cat.categoryName);
            setCategories(filteredCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSearch = () => {
        fetchProducts(searchTerm);
    };

    const handleUpdate = (productId) => {
        console.log('Update product with ID:', productId);
        const productToUpdate = products.find(product => product.productId === productId);
        setSelectedProduct(productToUpdate);
        setUpdatedProduct({
            productName: productToUpdate.productName || '',
            productPrice: productToUpdate.productPrice || '',
            productDescription: productToUpdate.productDescription || '',
            categoryId: productToUpdate.categoryId || '',
            productImage: null,
            productByteImage: productToUpdate.productByteImage // productByteImage'ı ayarla
        });
        setImagePreview(null);
    };

    const handleDelete = async (productId) => {
        try {
            await axiosInstance.delete(`/admin/product/${productId}`);
            toast.success('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            toast.error('Error deleting product!');
            console.error('Error deleting product:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct({ ...updatedProduct, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUpdatedProduct({ ...updatedProduct, productImage: file });

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpdateFinish = async () => {
        try {
            const formData = new FormData();
            formData.append('productId', selectedProduct.productId);
            formData.append('productName', updatedProduct.productName);
            formData.append('productPrice', updatedProduct.productPrice);
            formData.append('productDescription', updatedProduct.productDescription);
            formData.append('categoryId', updatedProduct.categoryId);

            // Product image conversion to base64
            const imageFile = updatedProduct.productImage;
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result.split(',')[1]; // Remove the data:image/jpeg;base64, part
                    formData.append('productByteImage', base64Image);
                    console.log("FormData:", formData); // Bu satırı ekledim, gönderilen veriyi kontrol etmek için
                    // Axios request
                    sendUpdateRequest(formData); // Axios isteği burada yapılıyor
                };
                reader.readAsDataURL(imageFile);
            } else {
                console.error('No product image found');
                // Axios request
                sendUpdateRequest(formData); // Axios isteği burada yapılıyor
            }
        } catch (error) {
            toast.error('Error updating product!');
            console.error('Error updating product:', error);
        }
    };

    const sendUpdateRequest = async (formData) => {
        try {
            await axiosInstance.put(`/admin/product/${selectedProduct.productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Product updated successfully!');
            fetchProducts();
            setSelectedProduct(null);
            setUpdatedProduct({
                productName: '',
                productPrice: '',
                productDescription: '',
                categoryId: '',
                productImage: null
            });
            setImagePreview(null);
        } catch (error) {
            toast.error('Error updating product!');
            console.error('Error updating product:', error);
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
                        <div className="product-actions">
                            <button className="update-button" onClick={() => handleUpdate(product.productId)}>Update</button>
                            <button className="delete-button" onClick={() => handleDelete(product.productId)}>Delete</button>
                        </div>
                        {selectedProduct && selectedProduct.productId === product.productId && (
                            <div className="update-product-form" ref={wrapperRef}>
                                <input
                                    type="text"
                                    name="productName"
                                    value={updatedProduct.productName || ''}
                                    onChange={handleChange}
                                    placeholder="Product Name"
                                />
                                <input
                                    type="text"
                                    name="productPrice"
                                    value={updatedProduct.productPrice || ''}
                                    onChange={handleChange}
                                    placeholder="Product Price"
                                />
                                <input
                                    type="text"
                                    name="productDescription"
                                    value={updatedProduct.productDescription || ''}
                                    onChange={handleChange}
                                    placeholder="Product Description"
                                />
                                <select
                                    name="categoryId"
                                    value={updatedProduct.categoryId || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                                    ))}
                                </select>
                                <input
                                    type="file"
                                    name="productImage"
                                    onChange={handleFileChange}
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Image Preview" className="image-preview" />
                                )}
                                <button onClick={handleUpdateFinish}>Update Finish</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ProductBox;
