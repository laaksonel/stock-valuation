import { StockData } from "../../domain/stock-valuation/stock.reducer";
import { StockValuationParams } from "../../domain/stock-valuation/StockValuationPage";

export interface StockValuation {
  valueInFiveYears: number;
  todayIntrinsicValue: number;
}

export function calculateValuation(valuationInputs: StockValuationParams): StockValuation {
  const {
    valuationData,
    multipliers
  } = valuationInputs;

  const {
    eps,
    fiveYearPE,
    expectedGrowth
  } = valuationData;

  const growthWithMarginOfSafety = expectedGrowth * (1 - multipliers.marginOfSafety);
  const asFiveYearGrowth = Math.pow(growthWithMarginOfSafety, 5);
  const result = fiveYearPE * eps * asFiveYearGrowth;

  return {
    valueInFiveYears: result,
    todayIntrinsicValue: result / Math.pow(1 + multipliers.discount, 5)
  }
}