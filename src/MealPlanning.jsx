import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './MealPlanning.css';
import Item from './Item';

const MealPlanning = ({ updateCartCount, handleItemSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [filters, setFilters] = useState({
        vegan: false,
        glutenFree: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();

    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:5000/recipes/search', {
                params: {
                    q: searchTerm,
                    vegan: filters.vegan,
                    gluten_free: filters.glutenFree,
                    page: page,
                    per_page: 20
                }
            });
            setRecipes(prevRecipes => {
                const newRecipes = response.data || [];
                setHasMore(newRecipes.length > 0);
                return [...prevRecipes, ...newRecipes];
            });
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to fetch recipes. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filters.vegan, filters.glutenFree, page]);

    useEffect(() => {
        setRecipes([]);
        setPage(1);
        setHasMore(true);
    }, [searchTerm, filters]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (filterName) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: !prevFilters[filterName]
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setRecipes([]);
        setPage(1);
        fetchRecipes();
    };

    const lastRecipeElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <div className="meal-planning-container">
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

export default MealPlanning;
