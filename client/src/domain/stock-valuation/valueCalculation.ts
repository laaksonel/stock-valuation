import { StockValuationParams, StockValuationMultipliers } from '../stockEntity';

export interface StockValuation {
  valueInFiveYears: number;
  todayIntrinsicValue: number;
}

type StockDataProps = StockValuationParams & {
  multipliers: StockValuationMultipliers,
};

export function calculateValuation(valuationInputs: StockDataProps): StockValuation {
  const {
    valuationData,
    multipliers,
  } = valuationInputs;

  const {
    eps,
    averageFiveYearPE,
    expectedGrowthRatePercent,
  } = valuationData;

  const growthWithMarginOfSafety = (100 * expectedGrowthRatePercent) * (1 - multipliers.marginOfSafety / 100);
  const asFiveYearGrowth = Math.pow(1 + (growthWithMarginOfSafety / 100), 5);
  const result = averageFiveYearPE * eps * asFiveYearGrowth;

  return {
    valueInFiveYears: result,
    todayIntrinsicValue: result / Math.pow(1 + multipliers.discount / 100, 5),
  };
}
