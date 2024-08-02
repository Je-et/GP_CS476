/* Essential for creating React components. */ 
import React, { useEffect, useState } from 'react';

/* Imports the Item component. */
import Item from './Item';

/* Used for sending HTTP request. */
import axios from 'axios';

/* CSS styles for Item List */
import './Itemlist.css';

/* Defines the ItemList component and initializes state. */
function ItemList({ items, updateCartCount, handleItemSelect, fetchFromAPI = true }) {
  
  /* bestSellers stores items */
  /* setBestSellers updates bestSellers */
  const [bestSellers, setBestSellers] = useState([]);

  /* newArrivals stores items */
  /* setNewArrivals updates newArrivals */
  const [newArrivals, setNewArrivals] = useState([]);

  /* recommendedItems stores items */
  /* setrecommendedItems updates recommendedItems */
  const [recommendedItems, setRecommendedItems] = useState([]);

  /* loading manages the loading state */
  /* setLoading updates the loading */
  const [loading, setLoading] = useState(fetchFromAPI);

  /* error handles any errors during data fetching */
  /* setError updates error */
  const [error, setError] = useState(null);

  /* Fetches data from the API if fetchFromAPI is true. */
  useEffect(() => {
    if (fetchFromAPI) {

      /* Asynchronously fetches data for best sellers, new arrivals, and recommended items. */
      const fetchItems = async () => {
        try {

          /* Executes multiple API requests concurrently. */
          const [bestSellersRes, newArrivalsRes, recommendedItemsRes] = await Promise.all([
            axios.get('http://localhost:5000/items/best-sellers'),
            axios.get('http://localhost:5000/items/new-arrivals'),
            axios.get('http://localhost:5000/items/recommendations')
          ]);

          setBestSellers(bestSellersRes.data);
          setNewArrivals(newArrivalsRes.data);
          setRecommendedItems(recommendedItemsRes.data);
          setLoading(false);

          /* Catches and logs errors, and sets an error message. */
        } catch (error) {
          console.error('Error fetching items:', error);
          setError('Failed to load items. Please try again later.');

          /* Updates loading state once data fetching is complete. */
          setLoading(false);
        }
      };

      fetchItems();
    }
  }, [fetchFromAPI]);

  /* Renders loading or error messages based on the component's state. */
  if (loading) {

    /* Shows a "Loading..." message while data is being fetched. */
    return <div className="loading">Loading...</div>;
  }

  if (error) {

    /* Displays an error message if data fetching fails. */
    return <div className="error">{error}</div>;
  }

  /* Renders a grid of Item components based on the provided itemList. */
  const renderItems = (itemList) => (
    <div className="item-grid">

      {/* Maps over the list of items and renders an Item component for each. */}
      {itemList.map(item => (
        <Item key={item.id} item={item} updateCartCount={updateCartCount} handleItemSelect={handleItemSelect} />
      ))}
    </div>
  );

  /* Renders a static list of items if fetchFromAPI is false. */
  if (!fetchFromAPI) {
    return (
      <div className="item-list-container">
        <section className="item-section">
          <div className="item-grid">

            {/* Maps over the provided items prop to render Item components. */}
            {items.map(item => (
              <Item key={item.id} item={item} updateCartCount={updateCartCount} handleItemSelect={handleItemSelect} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* Renders items fetched from the API into different sections. */
  return (
    <div className="item-list-container">

      {/*  Displays items under their respective headings using the renderItems function. */}
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

/* Exports the ItemList component so it can be used in other parts of the website. */
export default ItemList;