import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../store/slices/charactersSlice';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => (
  <div className="character-card">
    <img
      src={character.image}
      alt={character.name}
      className="character-image"
    />
    <div className="character-info">
      <Link to={`/character/${character.id}`} className="character-link">
        <h3>{character.name}</h3>
      </Link>
      <p>
        <b>Status:</b>
        <span className={`status ${character.status.toLowerCase()}`}>
          {character.status}
        </span>
      </p>
      <p><b>Species:</b> {character.species}</p>
      <p><b>Gender:</b> {character.gender}</p>
      <p><b>Origin:</b> {character.origin.name}</p>
    </div>
  </div>
);

export default CharacterCard;