import { StockSuggestion } from './search';
import { getStockSuggestions } from '../../core/api/stockSearchApi';
import { ThunkDispatch } from 'redux-thunk';
import debounce from 'lodash/debounce';

export interface ISearchState {
  currentSearch: string;
  suggestions: StockSuggestion[];
  error: boolean;
}

export type SearchDispatch = ThunkDispatch<ISearchState, void, SearchAction>;

const UPDATE_SEARCH = 'search/update-search';
const UPDATE_SUGGESTIONS_SUCCESS = 'search/update-suggestions-success';
const UPDATE_SUGGESTIONS_FAILURE = 'search/update-suggestions-failure';
const CLEAR_SUGGESTIONS = 'search/clear-suggestions';

interface UpdateSearch {
  type: typeof UPDATE_SEARCH;
  payload: string;
}

interface UpdateSuggestionsSuccess {
  type: typeof UPDATE_SUGGESTIONS_SUCCESS;
  payload: StockSuggestion[];
}

interface UpdateSuggestionsFailure {
  type: typeof UPDATE_SUGGESTIONS_FAILURE;
}

interface ClearSuggestions {
  type: typeof CLEAR_SUGGESTIONS;
}

export type SearchAction =
  | UpdateSearch
  | UpdateSuggestionsSuccess
  | UpdateSuggestionsFailure
  | ClearSuggestions;

export function updateSearch(searchValue: string) {
  return (dispatch: SearchDispatch) => dispatch({
    type: UPDATE_SEARCH,
    payload: searchValue,
  });
}

export function clearSuggestions(): SearchAction {
  return {
    type: CLEAR_SUGGESTIONS,
  };
}

function updateSuggestionsSuccess(suggestions: StockSuggestion[]): SearchAction {
  return {
    type: UPDATE_SUGGESTIONS_SUCCESS,
    payload: suggestions,
  };
}

function updateSuggestionsFailure(): SearchAction {
  return {
    type: UPDATE_SUGGESTIONS_FAILURE,
  };
}

const debouncedSuggestionFetch = debounce(async (dispatch: SearchDispatch, stockTicker: string) => {
  try {
    const suggestions = await getStockSuggestions(stockTicker);
    dispatch(updateSuggestionsSuccess(suggestions));
  } catch (err) {
    dispatch(updateSuggestionsFailure());
  }
},                                        500);

export function fetchStockSuggestions(s: string) {
  return (dispatch: SearchDispatch) => debouncedSuggestionFetch(dispatch, s);
}

const initialState: ISearchState = {
  currentSearch: '',
  suggestions: [],
  error: false,
};

export default (state: ISearchState = initialState, action: SearchAction): ISearchState => {
  switch (action.type) {
    case UPDATE_SEARCH:
      return {
        ...state,
        currentSearch: action.payload,
      };
    case UPDATE_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        suggestions: action.payload,
      };
    case UPDATE_SUGGESTIONS_FAILURE:
      return {
        ...state,
        suggestions: [],
        error: true,
      };
    case CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: [],
      };
    default:
      return state;
  }
};
