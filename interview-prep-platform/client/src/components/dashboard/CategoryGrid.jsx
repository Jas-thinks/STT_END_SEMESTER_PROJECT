import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Data Structures and Algorithms', path: '/quiz/dsa' },
  { name: 'Operating Systems', path: '/quiz/os' },
  { name: 'Database Management Systems', path: '/quiz/dbms' },
  { name: 'System Design', path: '/quiz/system-design' },
  { name: 'Machine Learning', path: '/quiz/ml' },
  { name: 'Deep Learning', path: '/quiz/dl' },
  { name: 'Generative AI', path: '/quiz/gen-ai' },
  { name: 'SQL', path: '/quiz/sql' },
  { name: 'Networking', path: '/quiz/networks' },
  { name: 'Aptitude', path: '/quiz/aptitude' },
];

const CategoryGrid = () => {
  return (
    <div className="category-grid">
      {categories.map((category) => (
        <Link key={category.name} to={category.path} className="category-card">
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;