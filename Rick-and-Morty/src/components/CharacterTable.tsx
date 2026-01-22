import React from 'react';
import { Character } from '../store/slices/charactersSlice';

interface CharacterTableProps {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

const CharacterTable: React.FC<CharacterTableProps> = ({ characters, loading, error }) => {
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!characters.length) return <div>No characters found</div>;

  return (
    <div className="table-container">
      <table className="character-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Status</th>
            <th>Species</th>
            <th>Gender</th>
            <th>Origin</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {characters.map(character => (
            <tr key={character.id}>
              <td>
                <img
                  src={character.image}
                  alt={character.name}
                  className="table-image"
                />
              </td>
              <td>{character.name}</td>
              <td>
                <span className={`status ${character.status.toLowerCase()}`}>
                  {character.status}
                </span>
              </td>
              <td>{character.species}</td>
              <td>{character.gender}</td>
              <td>{character.origin.name}</td>
              <td>{character.location.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CharacterTable;