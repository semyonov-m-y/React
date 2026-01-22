import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const LazySearchComponent = React.lazy(() => import('../components/SearchBar'));

const AboutPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="about-page">
      <h1>About Rick and Morty</h1>

      <div className="about-content">
        <p>
          Rick and Morty is an American adult animated science fiction sitcom created by
          Justin Roiland and Dan Harmon for Cartoon Network's nighttime programming block Adult Swim.
        </p>

        <p>
          The series follows the misadventures of cynical mad scientist Rick Sanchez and his good-hearted,
          but fretful grandson Morty Smith, who split their time between domestic life and interdimensional adventures.
        </p>

        <h2>Search in About Page</h2>

        <Suspense fallback={<div>Loading search component...</div>}>
          <LazySearchComponent
            initialValue={searchTerm}
            onSearch={handleSearch}
            onClear={handleClear}
            isAboutPage={true}
          />
        </Suspense>

        {searchParams.get('q') && (
          <div className="search-results">
            <h3>Search Results for: "{searchParams.get('q')}"</h3>
            <p>Your search term: {searchParams.get('q')}</p>
          </div>
        )}

        <div className="show-info">
          <h2>Show Information</h2>
          <ul>
            <li><strong>Created by:</strong> Justin Roiland and Dan Harmon</li>
            <li><strong>First episode:</strong> December 2, 2013</li>
            <li><strong>No. of seasons:</strong> 6</li>
            <li><strong>No. of episodes:</strong> 61</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;