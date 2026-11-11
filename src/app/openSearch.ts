import { createContext, useContext } from 'react';

/** Opens the command palette, optionally starting with `query` typed in. */
export const OpenSearchContext = createContext<(query?: string) => void>(() => {});

export const useOpenSearch = () => useContext(OpenSearchContext);
