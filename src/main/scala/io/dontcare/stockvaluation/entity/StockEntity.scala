package io.dontcare.stockvaluation.entity

import cats.Applicative
import io.circe.{Encoder, Json}
import org.http4s.EntityEncoder
import org.http4s.circe._

final case class StockTicker(ticker: String) extends AnyVal
final case class StockValuationResult(value: Float) extends AnyVal {
  def *(variable: StockValuationVariable) = variable.value * value
}

object StockValuationResult {
  implicit val stockValuationResultEncode: Encoder[StockValuationResult] = new Encoder[StockValuationResult] {
    override def apply(a: StockValuationResult): Json = Json.obj(
      // TODO: Fix this, return error message instead of null
      ("stockValuationResult", Json.fromFloat(a.value).getOrElse(Json.Null)),
    )
  }
  implicit def stockResultEntityEncoder[F[_]: Applicative]: EntityEncoder[F, StockValuationResult] =
    jsonEncoderOf[F, StockValuationResult]
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

