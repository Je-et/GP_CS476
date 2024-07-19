import React, { useState } from 'react';
import Item from './Item';
import './MealPlanning.css';

const dummyRecipes = [
    { id: 1, name: 'Vegan Salad', price: '$10', discount: '15%', image: 'https://via.placeholder.com/100', onSale: true, ingredients: [
        { id: 1, name: 'Lettuce', price: '$2', discount: '10%', image: 'https://via.placeholder.com/100', onSale: true },
        { id: 2, name: 'Tomatoes', price: '$3', discount: '5%', image: 'https://via.placeholder.com/100', onSale: false },
        { id: 3, name: 'Cucumbers', price: '$1.5', discount: '15%', image: 'https://via.placeholder.com/100', onSale: true },
        { id: 4, name: 'Olive Oil', price: '$7', discount: '0%', image: 'https://via.placeholder.com/100', onSale: false },
    ]},
    { id: 2, name: 'Chicken Soup', price: '$12', discount: '10%', image: 'https://via.placeholder.com/100', onSale: true, ingredients: [
        { id: 5, name: 'Chicken', price: '$5', discount: '10%', image: 'https://via.placeholder.com/100', onSale: true },
        { id: 6, name: 'Carrots', price: '$1', discount: '5%', image: 'https://via.placeholder.com/100', onSale: false },
        { id: 7, name: 'Onions', price: '$0.5', discount: '15%', image: 'https://via.placeholder.com/100', onSale: true },
        { id: 8, name: 'Garlic', price: '$0.2', discount: '0%', image: 'https://via.placeholder.com/100', onSale: false },
    ]},
    { id: 3, name: 'Pasta', price: '$8', discount: '5%', image: 'https://via.placeholder.com/100', onSale: true, ingredients: [
        { id: 9, name: 'Pasta', price: '$2', discount: '10%', image: 'https://via.placeholder.com/100', onSale: true },
        { id: 10, name: 'Tomato Sauce', price: '$3', discount: '5%', image: 'https://via.placeholder.com/100', onSale: false },
        { id: 11, name: 'Basil', price: '$1.5', discount: '15%', image: 'https://via.placeholder.com/100', onSale: true },
        { id: 12, name: 'Parmesan', price: '$4', discount: '0%', image: 'https://via.placeholder.com/100', onSale: false },
    ]},
];

const MealPlanning = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState(dummyRecipes);
    const [filters, setFilters] = useState({
        vegan: false,
        plantBased: false,
    });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        filterRecipes(e.target.value, filters);
    };

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked,
        }));
        filterRecipes(searchTerm, { ...filters, [name]: checked });
    };

    const filterRecipes = (term, filters) => {
        let filtered = dummyRecipes.filter((recipe) => 
            recipe.name.toLowerCase().includes(term.toLowerCase())
        );

        if (filters.vegan) {
            filtered = filtered.filter((recipe) => recipe.name.toLowerCase().includes('vegan'));
        }

        if (filters.plantBased) {
            filtered = filtered.filter((recipe) => recipe.name.toLowerCase().includes('plant'));
        }

        setFilteredRecipes(filtered);
    };

    return (
        <div className="meal-planning-container">
            <div className="search-bar">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search for a recipe"
                />
                <div className="filter-options">
                    <label>
                        <input 
                            type="checkbox"
                            name="vegan"
                            checked={filters.vegan}
                            onChange={handleFilterChange}
                        />
                        Vegan
                    </label>
                    <label>
                        <input 
                            type="checkbox"
                            name="plantBased"
                            checked={filters.plantBased}
                            onChange={handleFilterChange}
                        />
                        Plant-Based
                    </label>
                </div>
            </div>
            <div className="recipe-list">
                {filteredRecipes.map((recipe) => (
                    <div key={recipe.id} className="recipe-item">
                        <h3>{recipe.name}</h3>
                        <div className="item-list">
                            {recipe.ingredients.map((ingredient) => (
                                <Item key={ingredient.id} item={ingredient} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealPlanning;
