import React, { useEffect, useState } from 'react';
import Item from './Item';
import axios from 'axios';
import './Itemlist.css';

function ItemList() {
  const [previousItems, setPreviousItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreviousItems = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await axios.get('http://localhost:5000/items/previous', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setPreviousItems(response.data);
      } catch (error) {
        setError('Error fetching previous items');
      }
    };

    const fetchRecommendedItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items/recommendations');
        setRecommendedItems(response.data);
      } catch (error) {
        setError('Error fetching recommended items');
      }
    };

    fetchPreviousItems();
    fetchRecommendedItems();
    setLoading(false);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2 className="item-list-heading">Previous Purchases</h2>
      <div className="item-list">
        {previousItems.map(item => (
          <Item key={item.id} item={item} />
        ))}
      </div>
      <h2 className="item-list-heading">Recommended Items</h2>
      <div className="item-list">
        {recommendedItems.map(item => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default ItemList;
