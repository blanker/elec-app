import React, { createContext, useContext } from 'react';

export const SearchParamsContext = createContext();

export function SearchParamsProvider({ children }) {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source') ?? 'unknown';

    return (
        <SearchParamsContext.Provider value={{ source }}>
            {children}
        </SearchParamsContext.Provider>
    );
}

export function useSearchParamsValue() {
    return useContext(SearchParamsContext);
}