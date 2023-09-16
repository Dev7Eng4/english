import { useEffect, useState } from 'react';

type IFunc = () => void;

const useQuery = (url: string, options: RequestInit) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string>('');
  const [abort, setAbort] = useState<IFunc>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const abortController = new AbortController();
        const signal = abortController.signal;
        setAbort(abortController.abort);

        const res = await fetch(url, { ...options, signal });
        const json = await res.json();

        setData(json);
      } catch (error) {
        if (typeof error === 'string') {
          setError(error);
        }
      }
    };

    fetchData();

    return () => {
      abort && abort();
    };
  }, []);

  return { data, error, abort };
};

export default useQuery;
