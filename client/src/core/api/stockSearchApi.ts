import StockAxios from './stockAxios'
import { StockSuggestion } from '../../domain/stock-search/search';

export async function getStockSuggestions(searchValue: string) {
  const response = await StockAxios.get<StockSuggestion[]>('/search', {
    params: {
      stock: searchValue,
    },
  });

  return response.data;
}