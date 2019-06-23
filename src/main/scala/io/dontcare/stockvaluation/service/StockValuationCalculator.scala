package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.entity._

trait StockValuationCalculator {
  def priceEarningsMultiple(avgFiveYearPE: AvgFiveYearPE,
                            earningsPerShare: EarningsPerShare,
                            expectedGrowthRate: ExpectedGrowthRate): StockValuationResult
}

object StockValuationCalculator {

  def impl(marginOfSafety: Float): StockValuationCalculator = new StockValuationCalculator {

    def priceEarningsMultiple(avgFiveYearPE: AvgFiveYearPE,
                              earningsPerShare: EarningsPerShare,
                              expectedGrowthRate: ExpectedGrowthRate): StockValuationResult = {
      StockValuationResult(
        avgFiveYearPE * earningsPerShare * expectedGrowthRate.withMarginOfSafety(marginOfSafety).fiveYearGrowth()
      )
    }
  }
}
