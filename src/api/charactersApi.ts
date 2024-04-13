import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';

export const useCharacters = (name: string) => {
  const [_name, setName] = useState(name || '');

  useEffect(() => {
    setName(name);
  }, [name]);

  const { data, isLoading, error, handleFetchNext } = useFetch<Character>(
    `https://rickandmortyapi.com/api/character/?name=${_name}`
  );
  const characters = data?.results || [];
  const hasNext = !!data?.info.next;

  return {
    characters,
    isLoading,
    error,
    handleFetchNext,
    hasNext,
  };
};

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: Date;
}

export interface Location {
  name: string;
  url: string;
}
