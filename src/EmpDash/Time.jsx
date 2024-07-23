import React from 'react';
import './Time.css';
import OrderList from './OrderList';

function Time(time) {

    const PickOrder = (id, customerName, orderNumber) => {
        console.log('Pick Order:', id, customerName, orderNumber);
    };

    const CancelOrder = (id, customerName, orderNumber) => {
        console.log('Cancel Order:', id, customerName, orderNumber);
    };

    return (
        <div>
            <div className="time">
                <h5 className='text'>{time.name}</h5>
            </div>
            <div>
                <OrderList />
            </div>
        </div>
    );
}

export default Time;