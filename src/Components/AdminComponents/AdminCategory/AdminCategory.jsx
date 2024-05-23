// import React, { useState } from 'react';
// import './AdminCategory.css';
// import AdminNavbar from '../AdminNavbar/AdminNavbar';
// import axios from 'axios';

// const AddCategory = () => {
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [error, setError] = useState(null);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         try {
//             const response = await axios.post('http://localhost:9000/api/admin/category', {
//                 categoryName: name,
//                 categoryDescription: description
//             }, {
//                 withCredentials: true // Oturum bilgilerini tarayıcıdan otomatik olarak ekler
//             });

//             if (response.status !== 200) {
//                 throw new Error('Failed to add category');
//             }

//             // Kategori başarıyla eklendiyse, formu sıfırla
//             setName('');
//             setDescription('');
//             setError(null);

//             console.log('Category added successfully');
//         } catch (error) {
//             console.error('Error adding category:', error);
//             setError('Failed to add category');
//         }
//     };

//     return (
//         <div>
//             <AdminNavbar />
//             <h2>Add Category</h2>

//             <form onSubmit={handleSubmit}>
//                 <label htmlFor="name">Name:</label>
//                 <input type="text" id="name" placeholder='Category Name' value={name} onChange={(event) => setName(event.target.value)} />

//                 <label htmlFor="description">Description:</label>
//                 <textarea id="description" placeholder='Category Description' value={description} onChange={(event) => setDescription(event.target.value)} />

//                 {error && <div className="error-message">{error}</div>} {/* Hata mesajını göster */}

//                 <button type="submit">Add Category</button>
//             </form>
//         </div>
//     );
// };

// export default AddCategory;


import React, { useState } from 'react';
import './AdminCategory.css';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axiosInstance from '../../axiosInstance';

const AddCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post('/admin/category', {
                categoryName: name,
                categoryDescription: description
            });

            console.log(response); // Yanıtı kontrol et

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to add category');
            }

            // Kategori başarıyla eklendiyse, formu sıfırla
            setName('');
            setDescription('');
            setError(null);

            console.log('Category added successfully');
        } catch (error) {
            console.error('Error adding category:', error);
            setError(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <AdminNavbar />
            <h2>Add Category</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" placeholder='Category Name' value={name} onChange={(event) => setName(event.target.value)} />

                <label htmlFor="description">Description:</label>
                <textarea id="description" placeholder='Category Description' value={description} onChange={(event) => setDescription(event.target.value)} />

                {error && <div className="error-message">{error}</div>} {/* Hata mesajını göster */}

                <button type="submit">Add Category</button>
            </form>
        </div>
    );
};

export default AddCategory;
