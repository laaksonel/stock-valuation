import { StockValuationParams, StockValuationMultipliers } from '../stockEntity';
import { StockData } from './stock.reducer';

export interface StockValuation {
  valueInFiveYears?: number;
  todayIntrinsicValue?: number;
}

export type StockDataProps = StockValuationParams & {
  multipliers: StockValuationMultipliers,
};

type PresentData = {
  eps: number;
  averageFiveYearPE: number;
  expectedGrowthRatePercent: number;
};

export const hasValue = (x?: number): x is number => x !== undefined;
const hasAllValues = (data: StockData): data is PresentData => {
  const {
    eps,
    averageFiveYearPE,
    expectedGrowthRatePercent,
  } = data;

  return hasValue(averageFiveYearPE)
    && hasValue(eps)
    && hasValue(expectedGrowthRatePercent);
};

export function calculateValuation(
  multipliers: StockValuationMultipliers,
  valuationData: StockData,
): StockValuation {
  if (!hasAllValues(valuationData)) {
    return {
      valueInFiveYears: undefined,
      todayIntrinsicValue: undefined,
    };
  }

  const {
    expectedGrowthRatePercent,
    averageFiveYearPE,
    eps,
  } = valuationData;

  const growthWithMarginOfSafety =
    (100 * expectedGrowthRatePercent) * (1 - multipliers.marginOfSafety / 100);

  const asFiveYearGrowth = Math.pow(1 + (growthWithMarginOfSafety / 100), 5);
  const result = averageFiveYearPE * eps * asFiveYearGrowth;

  return {
    valueInFiveYears: result,
    todayIntrinsicValue: result / Math.pow(1 + multipliers.discount / 100, 5),
  };
}
