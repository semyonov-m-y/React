import React from 'react';

interface ViewToggleProps {
  viewMode: 'cards' | 'table';
  onViewChange: (mode: 'cards' | 'table') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewChange }) => (
  <div className="view-toggle">
    <button
      className={viewMode === 'cards' ? 'active' : ''}
      onClick={() => onViewChange('cards')}
    >
      <span className="icon">🃏</span> Cards
    </button>
    <button
      className={viewMode === 'table' ? 'active' : ''}
      onClick={() => onViewChange('table')}
    >
      <span className="icon">📊</span> Table
    </button>
  </div>
);

export default ViewToggle;