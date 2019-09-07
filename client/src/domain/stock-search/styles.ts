import styled from 'styled-components';
import { CSSProperties } from 'react';

export const SearchBoxDiv = styled.div`
    display: flex;

    width: 100%;
    max-width: 360px;

    box-sizing: border-box;

    border-radius: 4px;
    :focus: {
      border-color: #80bdff;
      box-shadow: '0 0 0 0.2rem rgba(0,123,255,.25)';
    };
    background-color: white;
    border: 1px solid #ced4da;
    padding: 3px;
    padding-left: 8px;
    font-family: ${
      [
        'Roboto',
        'sans-serif',
      ].join(',')
    }
`;

export const SuggestionDiv = styled.div`
  color: black;
  padding: 1%;
  border-radius: 0.1875rem;
  :hover {
    cursor: pointer;
    background-color: #80bdff;
  };
  width: 100%;
  box-sizing: border-box;
`;

export const searchBarTheme = {
  input: {
    border: 0,
    paddingLeft: '2%',
    width: '100%',
  },
  inputFocused: {
    outline: 'none',
  },
  container: {
    display: 'flex',
    flexGrow: 1,
  },
  suggestionsContainerOpen: {
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    maxWidth: '360px',
    display: 'block',
    margin: '30px auto',
    left: 0,
    right: 0,
    border: '1px solid #ced4da',
    borderRadius: 4,
    padding: 0,
  } as CSSProperties,
  suggestionsList: {
    listStyleType: 'none',
    padding: '0 0.5rem',
    margin: '0.5rem 0',
  },
};

export const SuggestionInfo = styled.div`
    display: inline-block
`;

export const SuggestionSymbol = styled(SuggestionInfo)`
  width: 25%
`;
