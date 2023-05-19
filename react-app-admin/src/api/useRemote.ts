import useSWR from "swr";

function fetchJson(url: string) {
  return fetch(url).then((res) => res.json());
}

export function useRemote<TData>(url: string) {
  const { data } = useSWR<TData>(url, fetchJson);

  return {
    data
  };
}
