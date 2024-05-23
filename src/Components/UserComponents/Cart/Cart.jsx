import React from 'react'
import UserNavbar from '../UserNavbar/UserNavbar'
import CartProduct from './CartProduct'
import './Cart.css'

function Cart() {
    return (
        <div>
            <UserNavbar />
            <br />
            <CartProduct />
        </div>

    )
}

export default Cart