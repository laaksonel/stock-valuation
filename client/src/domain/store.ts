import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { IAppState } from './app.reducer';
import search from './stock-search/search.reducer'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const rootReducer = combineReducers<IAppState>({
  search: search,
});

const store = (initialState?: IAppState) =>
  createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunk)));

export default store;