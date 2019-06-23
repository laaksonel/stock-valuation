package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.entity._

trait StockValutionCalculator {
  def priceEarningsMultiple(avgFiveYearPE: AvgFiveYearPE,
                            earningsPerShare: EarningsPerShare,
                            expectedGrowthRate: ExpectedGrowthRate): StockValuationResult
}

object StockValutionCalculator {

  def impl(marginOfSafety: Float): StockValutionCalculator = new StockValutionCalculator {

    def priceEarningsMultiple(avgFiveYearPE: AvgFiveYearPE,
                              earningsPerShare: EarningsPerShare,
                              expectedGrowthRate: ExpectedGrowthRate): StockValuationResult = {
      StockValuationResult(
        avgFiveYearPE * earningsPerShare * expectedGrowthRate.withMarginOfSafety(marginOfSafety).fiveYearGrowth()
      )
    }
  }
}
