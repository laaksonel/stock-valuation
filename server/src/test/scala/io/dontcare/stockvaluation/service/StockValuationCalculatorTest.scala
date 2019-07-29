package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.entity.{AverageFiveYearPE, EarningsPerShare, ExpectedGrowthRatePercent}
import org.scalactic.{Equality, TolerantNumerics}
import org.scalatest.FlatSpec
import org.scalatest.Matchers._

class StockValuationCalculatorTest extends FlatSpec {
  private val epsilon = 1e-2f
  implicit val floatEq: Equality[Float] = TolerantNumerics.tolerantFloatEquality(epsilon)

  "StockValueCalculator" should "calculate PE multiple with set margin of safety" in {
    val marginOfSafetyPercent = 25f
    val calculator = StockValuationCalculator.impl(marginOfSafetyPercent)

    val result = calculator.priceEarningsMultiple(
      AverageFiveYearPE(19),
      EarningsPerShare(2),
      ExpectedGrowthRatePercent(10f)
    )

    result.fiveYearFutureValue shouldEqual 54.55f
    result.todayIntrinsicValue shouldEqual 33.87f
  }

}
