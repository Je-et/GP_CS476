/* Essential for creating React components. */
import React, { useState, useEffect, useRef } from 'react';

/* Used for sending HTTP Requests */
import axios from 'axios';

/* CSS styling for the Search Bar */
import './SearchBar.css';

/* Defines the SearchBar functional component which takes handleItemSelect as a prop. */
function SearchBar({ handleItemSelect }) {
  /* Initializes state variables for managing the search query, results, and dropdown visibility. */
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  /* Creates a ref (dropdownRef) to manage clicks outside the dropdown. */
  const dropdownRef = useRef(null);

  useEffect(() => {
    /* Adds an event listener to close the dropdown when clicking outside of it. */
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    /* Cleans up the event listener when the component is unmounted. */
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    /* Fetches search results from the server when the query changes and is not empty */
    if (query.length > 0) {
      const fetchResults = async () => {
        try {
          console.log('Fetching results for query:', query);
          const response = await axios.get(`http://localhost:5000/items/search?q=${query}`);
          console.log('Received response:', response.data);
          /* Sets the fetched results to the results state and shows the dropdown. */
          setResults(response.data);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };
      fetchResults();
    } else {
      /* Clears results and hides the dropdown when the query is empty. */
      setResults([]);
      setShowDropdown(false);
    }
  }, [query]);

  /* Updates the search query state when the input value changes. */
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  /* Calls the handleItemSelect function with the selected item ID. */
  const handleResultClick = (itemId) => {
    if (typeof handleItemSelect === 'function') {
      handleItemSelect(itemId);
    } else {
      console.error('handleItemSelect is not a function');
    }
    /* Hides the dropdown and clears the search query. */
    setShowDropdown(false);
    setQuery('');
  };

  /* Renders the search bar input field. */
  return (
    <div className="search-bar-container" ref={dropdownRef}>
      <input
        type="text"
        className="header-search"
        placeholder="Search for Products ..."
        value={query}
        onChange={handleInputChange}
      />
      {/* Conditionally renders the dropdown menu with search results when showDropdown is true and there are results. */}
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

/* Exports the SearchBar component so it can be used in other parts of the website. */
export default SearchBar;