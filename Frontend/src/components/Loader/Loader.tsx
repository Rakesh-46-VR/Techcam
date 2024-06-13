import React from 'react';
import './Loader.css'; // Create a CSS file for loader styling

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;