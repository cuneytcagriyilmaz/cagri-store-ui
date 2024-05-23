
import React, { useState, useEffect } from 'react';
import './AdminProduct.css';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axiosInstance from '../../axiosInstance';

const AdminProduct = () => {
    const [file, setFile] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [category, setCategory] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [base64Image, setBase64Image] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/admin');
                const filteredCategories = response.data.filter((cat) => cat.categoryName);
                setCategories(filteredCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Resim değiştiğinde önizlemeyi güncelle ve base64 değerini set et
    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setBase64Image(base64String);
                setPreviewImage(reader.result);
            }; 
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    }, [file]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('categoryId', category.categoryId);
        formData.append('productByteImage', base64Image);
        formData.append('productPrice', price);
        formData.append('productDescription', description);
        formData.append('productName', name);

        try {
            const response = await axiosInstance.post('/admin/product', formData);
            console.log(response.data);
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    return (
        <div className="container">
            <AdminNavbar />
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="file">Select a File</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={(event) => setFile(event.target.files[0])}
                    />
                    {previewImage && (
                        <img src={previewImage} alt="Preview" className="preview-image" />
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={category ? category.categoryId : ''}
                        onChange={(event) => setCategory(categories.find(cat => cat.categoryId === parseInt(event.target.value)))}
                    >
                        <option value="">Select a Category</option>
                        {categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        required
                    />
                </div>
                <div className="form-group">

                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows="5"
                        required
                    />
                </div>

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AdminProduct;

