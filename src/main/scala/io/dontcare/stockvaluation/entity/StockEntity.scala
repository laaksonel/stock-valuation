package io.dontcare.stockvaluation.entity

import cats.Applicative
import io.circe.Encoder
import io.circe.generic.semiauto._
import org.http4s.EntityEncoder
import org.http4s.circe._

final case class StockTicker(ticker: String) extends AnyVal {
  override def toString: String = ticker
}

final case class StockValuationResult(fiveYearFutureValue: Float, todayIntrinsicValue: Float)

object StockValuationResult {
  implicit val stockValuationResultEncode: Encoder[StockValuationResult] =
    deriveEncoder[StockValuationResult]
  implicit def stockResultEntityEncoder[F[_]: Applicative]: EntityEncoder[F, StockValuationResult] =
    jsonEncoderOf[F, StockValuationResult]
}

sealed trait StockValuationVariable

final case class AvgFiveYearPE(value: Float) extends StockValuationVariable
final case class EarningsPerShare(value: Float) extends StockValuationVariable
final case class ExpectedGrowthRatePercent(value: Float) extends StockValuationVariable {
  def withMarginOfSafety(marginOfSafetyPercent: Float) =
    ExpectedGrowthRatePercent(1 + value * (1 - marginOfSafetyPercent))

  def fiveYearGrowth(): ExpectedGrowthRatePercent =
    ExpectedGrowthRatePercent(Math.pow(value, 5).floatValue())
}

