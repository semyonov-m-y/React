import { useState, useEffect } from 'react';
import axios from 'axios';
import { Character, Info } from '../store/slices/charactersSlice';

interface UseCharactersResult {
  characters: Character[];
  info: Info;
  loading: boolean;
  error: string | null;
}

const API_URL = 'https://rickandmortyapi.com/api/character';

export default function useCharacters(page: number, name: string): UseCharactersResult {
  const [data, setData] = useState<UseCharactersResult>({
    characters: [],
    info: {} as Info,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        const response = await axios.get<{ info: Info; results: Character[] }>(API_URL, {
          params: { page, name },
        });
        setData({
          characters: response.data.results,
          info: response.data.info,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setData({
          characters: [],
          info: {} as Info,
          loading: false,
          error: err.response?.data?.error || 'Failed to fetch characters',
        });
      }
    };

    fetchData();
  }, [page, name]);

  return data;
}