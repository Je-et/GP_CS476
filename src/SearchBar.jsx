import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './SearchBar.css';

function SearchBar({ handleItemSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const fetchResults = async () => {
        try {
          console.log('Fetching results for query:', query);
          const response = await axios.get(`http://localhost:5000/items/search?q=${query}`);
          console.log('Received response:', response.data);
          setResults(response.data);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };
      fetchResults();
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (itemId) => {
    if (typeof handleItemSelect === 'function') {
      handleItemSelect(itemId);
    } else {
      console.error('handleItemSelect is not a function');
    }
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <div className="search-bar-container" ref={dropdownRef}>
      <input
        type="text"
        className="header-search"
        placeholder="Search for Products ..."
        value={query}
        onChange={handleInputChange}
      />
      {showDropdown && results.length > 0 && (
        <div className="search-results-dropdown">
          {results.map((item) => (
            <div
              key={item.id}
              className="search-result-item"
              onClick={() => handleResultClick(item.id)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;