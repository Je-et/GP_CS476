import React, { useState } from 'react'
import './OrderCard.css';

const OrderCard = ({ order, onPickOrder, onCancelOrder }) => {
    const [customerName, setCustomerName] = useState(order.customerName);
    const [orderNumber, setOrderNumber] = useState(order.orderNumber);

    const PickOrder = () => {
        onPickOrder(order.id, customerName, orderNumber);
    };

    const CancelOrder = () => {
        onCancelOrder(order.id, customerName, orderNumber);
    };

    return (
        <div className="card">
            <div className="customerInfo">
                <div className="icon"></div>
                <div className='data'>
                    <div>
                        <div>Customer Name: {order.customerName}</div>
                    </div>
                    <div>
                        <div>Order Number: {order.orderNumber}</div>
                    </div>
                </div>
            </div>
            <div className="buttons">
                <button onClick={PickOrder} className="button">Pick Order</button>
                <button onClick={CancelOrder} className="button cancelButton">Cancel Order</button>
            </div>
        </div>
    )
}

export default OrderCard;