import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCharacters, setSearchParams } from '../store/slices/charactersSlice';
import { RootState } from '../store';
import CharacterList from '../components/CharacterList';
import CharacterTable from '../components/CharacterTable';
import ViewToggle from '../components/ViewToggle';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import AdminAccess from '../components/AdminAccess';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const dispatch = useDispatch();
  const { characters, info, loading, error, searchParams: storeSearchParams } = useSelector(
    (state: RootState) => state.characters
  );

  const page = parseInt(searchParams.get('page') || String(storeSearchParams.page));
  const name = searchParams.get('name') || storeSearchParams.name;

  useEffect(() => {
    dispatch(setSearchParams({ page, name }));
  }, [dispatch, page, name]);

  useEffect(() => {
    dispatch(fetchCharacters({ page, name }));
  }, [dispatch, page, name]);

  const handleViewChange = (mode: 'cards' | 'table') => {
    setViewMode(mode);
  };

  return (
    <>
      <div className="controls">
        <SearchBar initialValue={name} />
        <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />

        <button
          className="secret-admin-btn"
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          title="Click to toggle admin panel"
        >
          ⚙️
        </button>
      </div>

      {showAdminPanel && <AdminAccess />}

      {viewMode === 'cards' ? (
        <CharacterList
          characters={characters}
          loading={loading}
          error={error}
        />
      ) : (
        <CharacterTable
          characters={characters}
          loading={loading}
          error={error}
        />
      )}

      {!loading && !error && info && info.pages > 0 && (
        <Pagination
          currentPage={page}
          totalPages={info.pages}
        />
      )}
    </>
  );
};

export default HomePage;