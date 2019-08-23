import { ISearchState } from './stock-search/search.reducer';
import { IStockState } from './stock-valuation/stock.reducer';

export interface IAppState {
  search: ISearchState;
  stock: IStockState;
}
