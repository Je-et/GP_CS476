import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RecipeItem from './RecipeItem';
import './MealPlanning.css';

const MealPlanning = ({ updateCartCount, handleItemSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [filters, setFilters] = useState({
        vegan: false,
        plantBased: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:5000/recipes/search', {
                params: {
                    q: searchTerm,
                    vegan: filters.vegan,
                    plant_based: filters.plantBased
                }
            });
            setRecipes(response.data || []);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to fetch recipes. Please try again.');
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filters.vegan, filters.plantBased]);

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
        fetchRecipes();
    };

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
                            checked={filters.plantBased}
                            onChange={() => handleFilterChange('plantBased')}
                        />
                        Plant-Based
                    </label>
                </div>
            </div>
            <div className="meal-planning-content">
                <h1>Meal Planning</h1>
                {loading && <div className="loading">Loading recipes...</div>}
                {error && <div className="error">{error}</div>}
                <div className="recipes-container">
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <RecipeItem
                                key={recipe.id}
                                recipe={recipe}
                                updateCartCount={updateCartCount}
                                handleItemSelect={handleItemSelect}
                            />
                        ))
                    ) : (
                        <p>No recipes found. Try adjusting your search or filters.</p>
                    )}
            </div>
            </div>
        </div>
    );
};

export default MealPlanning;