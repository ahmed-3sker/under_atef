import { useEffect, useState } from "react";
import { errorMessage } from "../api/base";

type State<T> = { key: string | null; data?: T; error?: string };

// Fetches whenever `key` changes. Pass null to skip. `reload()` refetches.
// "loading" is derived from the key, so no setState runs synchronously in the effect.
export function useFetch<T>(key: string | null, fetcher: () => Promise<T>) {
  const [state, setState] = useState<State<T>>({ key: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ key, data });
      })
      .catch((err) => {
        if (!cancelled) setState({ key, error: errorMessage(err) });
      });
    return () => {
      cancelled = true;
    };
    // fetcher is a fresh closure every render; `key` is what identifies the request
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick]);

  const ready = key !== null && state.key === key;
  return {
    data: ready ? state.data : undefined,
    error: ready ? state.error : undefined,
    loading: key !== null && !ready,
    reload: () => setTick((t) => t + 1),
  };
}
