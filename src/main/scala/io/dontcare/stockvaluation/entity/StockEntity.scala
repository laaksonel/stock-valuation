package io.dontcare.stockvaluation.entity

final case class StockTicker(ticker: String) extends AnyVal
final case class StockValuationResult(value: Float) extends AnyVal {
  def *(variable: StockValuationVariable) = variable.value * value
}

abstract class StockValuationVariable {
  def value: Float
  def *(variable: StockValuationVariable) = StockValuationResult(variable.value * value)
}

final case class AvgFiveYearPE(value: Float) extends StockValuationVariable
final case class EarningsPerShare(value: Float) extends StockValuationVariable
final case class ExpectedGrowthRate(value: Float) extends StockValuationVariable {
  def withMarginOfSafety(marginOfSafety: Float) =
    ExpectedGrowthRate(1 + value * marginOfSafety)

  def fiveYearGrowth(): ExpectedGrowthRate =
    ExpectedGrowthRate(Math.pow(value, 5).floatValue())
}

