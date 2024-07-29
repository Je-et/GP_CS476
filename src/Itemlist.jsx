import React, { useEffect, useState } from 'react';
import Item from './Item';
import axios from 'axios';
import './Itemlist.css';

function ItemList({ items, updateCartCount, handleItemSelect, fetchFromAPI = true }) {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(fetchFromAPI);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fetchFromAPI) {
      const fetchItems = async () => {
        try {
          const [bestSellersRes, newArrivalsRes, recommendedItemsRes] = await Promise.all([
            axios.get('http://localhost:5000/items/best-sellers'),
            axios.get('http://localhost:5000/items/new-arrivals'),
            axios.get('http://localhost:5000/items/recommendations')
          ]);

          setBestSellers(bestSellersRes.data);
          setNewArrivals(newArrivalsRes.data);
          setRecommendedItems(recommendedItemsRes.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching items:', error);
          setError('Failed to load items. Please try again later.');
          setLoading(false);
        }
      };

      fetchItems();
    }
  }, [fetchFromAPI]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const renderItems = (itemList) => (
    <div className="item-grid">
      {itemList.map(item => (
        <Item key={item.id} item={item} updateCartCount={updateCartCount} handleItemSelect={handleItemSelect} />
      ))}
    </div>
  );

  if (!fetchFromAPI) {
    return (
      <div className="item-list-container">
        <section className="item-section">
          <div className="item-grid">
            {items.map(item => (
              <Item key={item.id} item={item} updateCartCount={updateCartCount} handleItemSelect={handleItemSelect} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="item-list-container">
      <section className="item-section">
        <h2 className="item-list-heading">Best Sellers</h2>
        {renderItems(bestSellers)}
      </section>

      <section className="item-section">
        <h2 className="item-list-heading">New Arrivals</h2>
        {renderItems(newArrivals)}
      </section>

      <section className="item-section">
        <h2 className="item-list-heading">Recommended Items</h2>
        {renderItems(recommendedItems)}
      </section>
    </div>
  );
}

export default ItemList;