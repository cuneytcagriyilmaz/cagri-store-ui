import React from 'react';
import AdminNavbar from './AdminNavbar/AdminNavbar';
import ProductBox from './AdminProduct/ProductBox';

function AdminPage() {
  return (
    <div>
      <AdminNavbar />
      <div className="product-container">
        <ProductBox />
      </div>
    </div>
  );
}

export default AdminPage;
