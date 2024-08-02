/* Essential for creating React components. */
import React from 'react';

/* Import Item component */
import Item from './Item';

/* CSS styling for Recipe Item */
import './RecipeItem.css';

/* Defines the RecipeItem functional component which takes recipe and updateCartCount as props. */
const RecipeItem = ({ recipe, updateCartCount }) => {

  /* Renders the recipe name and description. */
  return (
    <div className="recipe-item">
      <h3 className="recipe-name">{recipe.name}</h3>
      <p className="recipe-description">{recipe.description}</p>
      {/* Conditionally renders tags for vegan and plant-based recipes.*/}
      <div className="recipe-tags">
        {recipe.is_vegan && <span className="recipe-tag vegan">Vegan</span>}
        {recipe.is_plant_based && <span className="recipe-tag plant-based">Plant-Based</span>}
      </div>
      {/* Maps over the ingredients array and renders each ingredient using the Item component. */}
      <div className="ingredients-grid">
        {recipe.ingredients && recipe.ingredients.map((ingredient) => (
          /* Passes the ingredient.id as the key */
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

/* Exports the RecipeItem component so it can be used in other parts of the website. */
export default RecipeItem;