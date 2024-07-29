import React from 'react';
import Item from './Item';
import './RecipeItem.css';

const RecipeItem = ({ recipe, updateCartCount }) => {
  return (
    <div className="recipe-item">
      <h3 className="recipe-name">{recipe.name}</h3>
      <p className="recipe-description">{recipe.description}</p>
      <div className="recipe-tags">
        {recipe.is_vegan && <span className="recipe-tag vegan">Vegan</span>}
        {recipe.is_plant_based && <span className="recipe-tag plant-based">Plant-Based</span>}
      </div>
      <div className="ingredients-grid">
        {recipe.ingredients && recipe.ingredients.map((ingredient) => (
          <Item 
            key={ingredient.id} 
            item={ingredient.item} 
            updateCartCount={updateCartCount}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeItem;