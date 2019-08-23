import StockAxios from './stockAxios';
import { StockDataResponse } from '../../domain/stock-valuation/stock.reducer';

export async function getStockData(stockTicker: string) {
  const response = await StockAxios.get<StockDataResponse>(`/data/${stockTicker}`);
  return response.data;
}
