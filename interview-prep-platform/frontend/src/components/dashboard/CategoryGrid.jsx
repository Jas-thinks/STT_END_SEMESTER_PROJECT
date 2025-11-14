import React from 'react';

const CategoryGrid = ({ categories }) => (
  <div className="category-grid">
    {categories.map(cat => (
      <div key={cat.id} className="category-item">{cat.name}</div>
    ))}
  </div>
);

export default CategoryGrid;
