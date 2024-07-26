import React from 'react';
import './Item.css';

function Item({ item }) {
  return (
    <div className="item">
      <div className="item-picture">
        <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
      </div>
      <div className="item-details">
        {item.discount > 0 && (
          <div className="item-discount">
            {item.discount}% OFF
          </div>
        )}
        <div className="item-name">{item.name}</div>
        <div className="item-price">${item.price.toFixed(2)}</div>
        <button className="add-to-cart">Add</button>
      </div>
    </div>
  );
}

export default Item;
