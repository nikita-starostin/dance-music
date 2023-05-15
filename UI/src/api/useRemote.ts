import { useEffect, useState } from 'react';


export function useRemote<TData>(url: string, fakeData?: TData) {
  const [ loading, setLoading ] = useState(true);
  const [ data, setData ] = useState<TData | undefined>(undefined);
  useEffect(() => {
    if (fakeData) {
      Promise.resolve(fakeData).then(p => setData(p));
    } else {
      fetch(url).then((response) => {
        if(response.ok) {
          response
              .json()
              .then(setData);
        }
      });
    }
  }, []);

  return {
    loading,
    data
  };
}
