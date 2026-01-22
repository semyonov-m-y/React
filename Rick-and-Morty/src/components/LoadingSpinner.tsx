import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading characters...</p>
  </div>
);

export default LoadingSpinner;