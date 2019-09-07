import StockAxios from './stockAxios';
import { StockSuggestion } from '../../domain/stock-search/search';

// TODO: Error handling
export async function getStockSuggestions(searchValue: string) {
  const response = await StockAxios.get<StockSuggestion[]>('/suggestions', {
    params: {
      searchTerm: searchValue,
    },
  });

  return response.data;
}
