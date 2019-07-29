package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.entity._

trait StockValuationCalculator {
  def priceEarningsMultiple(avgFiveYearPE: AverageFiveYearPE,
                            earningsPerShare: EarningsPerShare,
                            expectedGrowthRate: ExpectedGrowthRatePercent): StockValuationResult
}

object StockValuationCalculator {

  def impl(marginOfSafety: Percent): StockValuationCalculator = new StockValuationCalculator {

    def priceEarningsMultiple(avgFiveYearPE: AverageFiveYearPE,
                              earningsPerShare: EarningsPerShare,
                              expectedGrowthRate: ExpectedGrowthRatePercent): StockValuationResult = {
      println(s"Avg PE: $avgFiveYearPE")
      println(s"EPS: $earningsPerShare")
      println(s"Growth: $expectedGrowthRate")

      val fiveYearValue = avgFiveYearPE.value * earningsPerShare.value * expectedGrowthRate.withMarginOfSafety(marginOfSafety).fiveYearGrowth().annualGrowthPercent
      val todayIntrinsicValue = fiveYearValue / Math.pow(1.1f, 5).toFloat // TODO: Hardcoded discount 10%, get historical returns instead and calculate based on that
      StockValuationResult(
        fiveYearValue,
        todayIntrinsicValue
      )
    }
  }
}
