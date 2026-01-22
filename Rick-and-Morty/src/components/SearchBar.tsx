import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchParams } from '../store/slices/charactersSlice';

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (e: React.FormEvent) => void;
  onClear?: () => void;
  isAboutPage?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  onSearch,
  onClear,
  isAboutPage = false
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAboutPage && onSearch) {
      onSearch(e);
      return;
    }

    const params = new URLSearchParams(location.search);
    params.set('name', searchTerm);
    params.set('page', '1');

    dispatch(setSearchParams({ name: searchTerm, page: 1 }));

    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleClearClick = () => {
    setSearchTerm('');

    if (isAboutPage && onClear) {
      onClear();
      return;
    }

    const params = new URLSearchParams(location.search);
    params.delete('name');

    dispatch(setSearchParams({ name: '' }));

    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={isAboutPage ? "Search in about page..." : "Search characters..."}
      />
      <button type="submit">Search</button>
      {searchTerm && (
        <button type="button" onClick={handleClearClick}>Clear</button>
      )}
    </form>
  );
};

export default SearchBar;