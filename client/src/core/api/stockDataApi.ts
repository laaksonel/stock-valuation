import StockAxios from './stockAxios'
import { StockData } from '../../domain/stock-valuation/stock.reducer';

export async function getStockData(stockTicker: string) {
  const response = await StockAxios.get<StockData>('/data', {
    params: {
      symbol: stockTicker,
    },
  });

  return response.data;
}