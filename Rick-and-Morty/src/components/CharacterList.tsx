import React from 'react';
import { Character } from '../store/slices/charactersSlice';
import CharacterCard from './CharacterCard';
import LoadingSpinner from './LoadingSpinner';

interface CharacterListProps {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, loading, error }) => {
  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="error-message">
      <h3>Error Loading Characters</h3>
      <p>{error}</p>
    </div>
  );

  if (!characters.length) return (
    <div className="no-results">
      <h3>No Characters Found</h3>
      <p>Try adjusting your search criteria.</p>
    </div>
  );

  return (
    <div className="character-list">
      {characters.map(character => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
};

export default CharacterList;