import React, { useState } from 'react'
import OrderCard from './OrderCard';

const OrderList = () => {
    const [orders, setOrders] = useState([
        { id: 1, customerName: 'Bella Fecher', orderNumber: '5310004556689' },
        { id: 2, customerName: 'Bob Marlow', orderNumber: '5310004523987' },
        { id: 3, customerName: 'Catheline Monroe', orderNumber: '5310004523456'},
        
    ]);




    const handlePickOrder = (id, customerName, orderNumber) => {
        console.log('Pick Order:', id, customerName, orderNumber);
    };

    const handleCancelOrder = (id, customerName, orderNumber) => {
        console.log('Cancel Order:', id, customerName, orderNumber);
    };

    return (
        <div>
            {orders.map(order => (
                <OrderCard
                    key={order.id}
                    order={order}
                    onPickOrder={handlePickOrder}
                    onCancelOrder={handleCancelOrder}
                />
            ))}
        </div>
    )
}

export default OrderList