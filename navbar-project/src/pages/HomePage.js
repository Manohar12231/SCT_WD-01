import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to My Portfolio</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Discover my projects and skills.</p>
      </div>
    </div>
  );
};

export default HomePage;