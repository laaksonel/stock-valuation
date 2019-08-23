import { createStore, combineReducers, applyMiddleware } from 'redux';
import { IAppState } from './app.reducer';
import searchReducer from './stock-search/search.reducer';
import stockReducer from './stock-valuation/stock.reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const rootReducer = combineReducers<IAppState>({
  search: searchReducer,
  stock: stockReducer,
});

const store = (initialState?: IAppState) =>
  createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunk)));

export default store;
