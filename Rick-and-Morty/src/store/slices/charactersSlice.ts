import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://rickandmortyapi.com/api/character';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharactersResponse {
  info: Info;
  results: Character[];
}

interface SearchParams {
  page: number;
  name: string;
}

interface CharactersState {
  characters: Character[];
  info: Info;
  loading: boolean;
  error: string | null;
  searchParams: SearchParams;
}

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async ({ page, name }: SearchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get<CharactersResponse>(API_URL, {
        params: { page, name },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch characters');
    }
  }
);

const initialState: CharactersState = {
  characters: [],
  info: {} as Info,
  loading: false,
  error: null,
  searchParams: {
    page: 1,
    name: '',
  },
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<Partial<SearchParams>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.characters = action.payload.results || [];
        state.info = action.payload.info || {} as Info;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.characters = [];
        state.info = {} as Info;
      });
  },
});

export const { setSearchParams, clearError } = charactersSlice.actions;
export default charactersSlice.reducer;