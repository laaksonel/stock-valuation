package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.entity._

trait StockValuationCalculator {
  def priceEarningsMultiple(avgFiveYearPE: Option[AverageFiveYearPE],
                            earningsPerShare: EarningsPerShare,
                            expectedGrowthRate: ExpectedGrowthRatePercent): Option[StockValuationResult]
}

object StockValuationCalculator {

  def impl(marginOfSafety: Percent): StockValuationCalculator = (avgFiveYearPE: Option[AverageFiveYearPE],
                                                                 earningsPerShare: EarningsPerShare,
                                                                 expectedGrowthRate: ExpectedGrowthRatePercent) => {
    avgFiveYearPE.map { avg =>
      val fiveYearValue =
          avg.value *
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
}
