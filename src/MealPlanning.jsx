/* Essential for creating React components. */
import React, { useState, useEffect, useCallback, useRef } from 'react';

/* For making HTTP requests */
import axios from 'axios';

/* CSS styling for Meal Planning */
import './MealPlanning.css';

/* Imports a component used to render individual ingredients. */
import Item from './Item';


const MealPlanning = ({ updateCartCount, handleItemSelect }) => {

    /* Stores the current query for recipe search. */
    const [searchTerm, setSearchTerm] = useState('');

    /* Holds the list of recipes retrieved from the server. */
    const [recipes, setRecipes] = useState([]);

    /* Manages filter states */
    const [filters, setFilters] = useState({
        vegan: false,
        glutenFree: false,
    });

    /*  Indicates whether the component is currently fetching data. */
    const [loading, setLoading] = useState(true);

    /* Stores any error messages related to data fetching. */
    const [error, setError] = useState(null);

    /* Keeps track of the current page. */
    const [page, setPage] = useState(1);

    /* Indicates if there are more recipes to load. */
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();

    /* Asynchronously fetches recipes from the server based on search and filter parameters. */
    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            /* Sends a GET request */
            const response = await axios.get('http://localhost:5000/recipes/search', {
                params: {
                    /* Search query. */
                    q: searchTerm,
                    /* Filter for vegan recipes. */
                    vegan: filters.vegan,
                    /* Filter for gluten-free recipes. */
                    gluten_free: filters.glutenFree,
                    /* Current page */
                    page: page,
                    /* Number of recipes per page. */
                    per_page: 20
                }
            });
            setRecipes(prevRecipes => {
                const newRecipes = response.data || [];
                setHasMore(newRecipes.length > 0);
                return [...prevRecipes, ...newRecipes];
            });
        } catch (error) {
            /* Displays error messages */
            console.error('Error fetching recipes:', error);
            setError('Failed to fetch recipes. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filters.vegan, filters.glutenFree, page]);

    /* Clears recipes, resets the page, and sets hasMore to true when search term or filters change. */
    useEffect(() => {
        setRecipes([]);
        setPage(1);
        setHasMore(true);
    }, [searchTerm, filters]);

    /* Calls fetchRecipes whenever its dependencies change */
    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    /* Updates searchTerm as the user types in the search input. */
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    /* Toggles the value of a specific filter */
    const handleFilterChange = (filterName) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: !prevFilters[filterName]
        }));
    };

    /* Prevents default form submission, resets recipes and page, and triggers a new search. */
    const handleSearch = (e) => {
        e.preventDefault();
        setRecipes([]);
        setPage(1);
        fetchRecipes();
    };

    /* A callback ref for the last recipe element */
    const lastRecipeElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        /* Detect when the last recipe is visible in the viewport */
        observer.current = new IntersectionObserver(entries => {
            /* Increments the page number to load the next set of recipes if more recipes are available. */
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <div className="meal-planning-container">
            {/* Contains a search form and filter options */ }
            <div className="meal-planning-sidebar">
                <h2>Search Recipes</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search for recipes..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
                <div className="filter-options">
                    <h3>Filters</h3>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.vegan}
                            onChange={() => handleFilterChange('vegan')}
                        />
                        Vegan
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.glutenFree}
                            onChange={() => handleFilterChange('glutenFree')}
                        />
                        Gluten-free
                    </label>
                </div>
            </div>

            {/* Displays the list of recipes, including their name, description, tags (e.g., vegan, gluten-free), and ingredients. */}
            <div className="meal-planning-content">
                <h1>Meal Planning</h1>
                {loading && <div className="loading">Loading recipes...</div>}
                {error && <div className="error">{error}</div>}
                {recipes.map((recipe, index) => (
                    <div
                        key={recipe.id}
                        className="recipe-section"
                        ref={recipes.length === index + 1 ? lastRecipeElementRef : null}
                    >
                        <h2 className="recipe-name">{recipe.name}</h2>
                        <p className="recipe-description">{recipe.description}</p>
                        <div className="recipe-tags">
                            {recipe.is_vegan && <span className="recipe-tag vegan">Vegan</span>}
                            {recipe.is_gluten_free && <span className="recipe-tag gluten-free">Gluten-Free</span>}
                        </div>
                        <div className="ingredients-container">
                            {recipe.ingredients.map(ingredient => (
                                <Item
                                    key={ingredient.id}
                                    item={ingredient}
                                    updateCartCount={updateCartCount}
                                    handleItemSelect={handleItemSelect}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* Exports the MealPlanning component so it can be used in other parts of the website. */
export default MealPlanning;
