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

final case class AverageFiveYearPE(value: Float) extends StockValuationVariable
final case class EarningsPerShare(value: Float) extends StockValuationVariable
final case class ExpectedGrowthRatePercent(annualGrowthPercent: Percent) extends StockValuationVariable {
  def withMarginOfSafety(marginOfSafetyPercent: Percent) =
    ExpectedGrowthRatePercent(annualGrowthPercent * (1f - marginOfSafetyPercent.toDecimal))

  def fiveYearGrowth(): ExpectedGrowthRatePercent =
    ExpectedGrowthRatePercent(Math.pow(annualGrowthPercent.toGrowthDecimal, 5).floatValue())
}
