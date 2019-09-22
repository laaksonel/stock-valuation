package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.entity.{AverageFiveYearPE, EarningsPerShare, ExpectedGrowthRatePercent}
import org.specs2.mutable.Specification

class StockValuationCalculatorTest extends Specification {
  "StockValueCalculator" >> {
    "calculates PE multiplier" >> {
      val result = calculatePEMultiplier()

      // Just round the results up to 2 decimals
      // instead of defining custom equality for type Option[Float]
      // because it gets really messy because of the type erasure
      val fiveYearValue = result
        .map(_.fiveYearFutureValue)
        .map(toTwoDecimals)

      val todayIntrinsicValue = result
        .map(_.todayIntrinsicValue)
        .map(toTwoDecimals)

      fiveYearValue must beSome(54.55f)
      todayIntrinsicValue must beSome(33.87f)
    }
  }

  private def calculatePEMultiplier() = {
    val marginOfSafetyPercent = 25f
    val calculator = StockValuationCalculator.impl(marginOfSafetyPercent)

    calculator.priceEarningsMultiple(
      Some(AverageFiveYearPE(19)),
      EarningsPerShare(2),
      ExpectedGrowthRatePercent(10f)
    )
  }

  private def toTwoDecimals(f: Float) =
    Math.round(f * 100) / 100.0f
}
