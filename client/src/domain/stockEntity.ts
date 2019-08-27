import { StockData } from './stock-valuation/stock.reducer';

export interface StockValuationParams {
  valuationData: StockData;
}

export interface StockValuationMultipliers {
  discount: number;
  marginOfSafety: number;
}

export type StockMultiplierKey = keyof StockValuationMultipliers;
