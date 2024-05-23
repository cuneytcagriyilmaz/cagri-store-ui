import React from 'react';
import UserNavbar from './UserNavbar/UserNavbar';
import UserProduct from './UserProduct/UserProduct';
const UserPage = () => {
    return (
        <div>
            <UserNavbar />
            <h2>User Page</h2>
            <UserProduct />
        </div>
    );
};

export default UserPage;


