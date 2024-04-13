import { useState, useEffect } from 'react';

type ApiResponse<T> = {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results: T[];
};

export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<ApiResponse<T>>({
    info: { count: 0, pages: 0, next: '', prev: '' },
    results: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const handleFetchNext = async () => {
    if (!data.info.next || isLoading) return;
    const response = await fetch(data.info.next);
    const json = await response.json();
    setData((prevData) => ({
      ...json,
      results: [...prevData.results, ...json.results],
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setIsLoading(false);
        setData(json);
        setError('');
      } catch (error) {
        setError(`${error} Could not Fetch Data`);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, isLoading, error, handleFetchNext };
};
