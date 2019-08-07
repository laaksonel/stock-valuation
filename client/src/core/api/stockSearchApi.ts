import StockAxios from './stockAxios'
import { StockSuggestion } from '../../domain/stock-search/search';

export async function getStockSuggestions(searchValue: string) {
  const response = await StockAxios.get<StockSuggestion[]>('/suggestions', {
    params: {
      symbol: searchValue,
    },
  });

  return response.data;
}