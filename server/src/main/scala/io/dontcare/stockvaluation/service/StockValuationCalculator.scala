package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.entity._

trait StockValuationCalculator {
  def priceEarningsMultiple(avgFiveYearPE: AverageFiveYearPE,
                            earningsPerShare: EarningsPerShare,
                            expectedGrowthRate: ExpectedGrowthRatePercent): StockValuationResult
}

object StockValuationCalculator {

  def impl(marginOfSafety: Percent): StockValuationCalculator = (avgFiveYearPE: AverageFiveYearPE,
                                                                 earningsPerShare: EarningsPerShare,
                                                                 expectedGrowthRate: ExpectedGrowthRatePercent) => {
    val fiveYearValue =
      avgFiveYearPE.value *
      earningsPerShare.value *
      expectedGrowthRate.withMarginOfSafety(marginOfSafety).fiveYearGrowth().annualGrowthPercent

    // TODO: Hardcoded discount 10%, get historical returns instead and calculate based on that
    val todayIntrinsicValue = fiveYearValue / Math.pow(1.1f, 5).toFloat

    StockValuationResult(
      fiveYearValue,
      todayIntrinsicValue
    )
  }
}
