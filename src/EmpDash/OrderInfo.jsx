import React from 'react';
import OrderDetail from './OrderDetail';
import './OrderInfo.css';

function OrderInfo() {

  const orders = [
    { id:1, customerName: 'Bella fetcher', orderNumber: '5310004556689', deliveryTime: '8:00 AM', status: 'picking' },
    { id: 2, customerName: 'Kelly elliot', orderNumber: '5319038489453', deliveryTime: '9:00 AM', status: 'completed' },
    { id:1, customerName: 'Emily white', orderNumber: '5310004556689', deliveryTime: '10:00 AM', status: 'picking' },
    { id: 2, customerName: 'Cora burkitt', orderNumber: '5319038489453', deliveryTime: '11:00 AM', status: 'completed' },
  ];

  return (
    <div className="order-list">
      {orders.map((order, index) => (
        <OrderDetail
          key={index}
          customerName={order.customerName}
          orderNumber={order.orderNumber}
          deliveryTime={order.deliveryTime}
          status={order.status}
        />
      ))}
    </div>
  );
}

export default OrderInfo;
