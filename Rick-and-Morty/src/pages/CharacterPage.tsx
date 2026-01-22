import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Character } from '../store/slices/charactersSlice';

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Character>(`https://rickandmortyapi.com/api/character/${id}`);
        setCharacter(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch character');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) return <div className="loading">Loading character...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!character) return <div>Character not found</div>;

  return (
    <div className="character-detail">
      <Link to="/" className="back-link">← Back to Characters</Link>

      <div className="character-detail-card">
        <img src={character.image} alt={character.name} className="detail-image" />

        <div className="character-detail-info">
          <h1>{character.name}</h1>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className={`value status ${character.status.toLowerCase()}`}>
                {character.status}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Species:</span>
              <span className="value">{character.species}</span>
            </div>

            <div className="detail-item">
              <span className="label">Gender:</span>
              <span className="value">{character.gender}</span>
            </div>

            <div className="detail-item">
              <span className="label">Origin:</span>
              <span className="value">{character.origin.name}</span>
            </div>

            <div className="detail-item">
              <span className="label">Location:</span>
              <span className="value">{character.location.name}</span>
            </div>

            {character.type && (
              <div className="detail-item">
                <span className="label">Type:</span>
                <span className="value">{character.type}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;