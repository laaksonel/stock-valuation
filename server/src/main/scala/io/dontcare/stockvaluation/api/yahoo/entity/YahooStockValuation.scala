package io.dontcare.stockvaluation.api.yahoo.entity

import cats.Applicative
import cats.effect.Sync
import io.circe.{Decoder, Encoder, Json}
import org.http4s.{EntityDecoder, EntityEncoder}
import org.http4s.circe._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

// TODO: Use enumeratum
object StockTimeInterval extends Enumeration {
  type StockTimeInterval = Value
  val plusFiveYears = Value("+5y")
  val minusFiveYears = Value("-5y")
  val plusOneYear = Value("+1y")
  val plusOneQuarter = Value("+1q")
  val currentQuarter = Value("0q")
  val currentYear = Value("0y")
  val empty = Value("")

  implicit val decodeTimeInterval: Decoder[StockTimeInterval] =
    Decoder.decodeString
      .map {
        periodStr => StockTimeInterval
          .values
          .find(_.toString == periodStr)
          .getOrElse(StockTimeInterval.empty)
      }

  implicit val encodeGrowth: Encoder[StockTimeInterval] = (a: StockTimeInterval) => Json.fromString(a.toString)
}

import StockTimeInterval._

sealed trait YahooStockInformation

final case class RawValue(raw: Float)

object RawValue {
  implicit val decodeGrowth: Decoder[RawValue] = deriveDecoder[RawValue]
  implicit val encodeGrowth: Encoder[RawValue] = deriveEncoder[RawValue]
}

final case class EarningsEstimate(period: StockTimeInterval, growth: RawValue)

object EarningsEstimate {
  implicit val decodeEstimate: Decoder[EarningsEstimate] = deriveDecoder[EarningsEstimate]
  implicit val encodeEstimate: Encoder[EarningsEstimate] = deriveEncoder[EarningsEstimate]

  implicit def estimateEntityEncoder[F[_]: Applicative]: EntityEncoder[F, EarningsEstimate] =
    jsonEncoderOf
}

final case class EarningsTrend(trend: Seq[EarningsEstimate])

object EarningsTrend {
  implicit val decodeTrend: Decoder[EarningsTrend] =
    deriveDecoder[EarningsTrend].prepare(
      _.downField("quoteSummary")
        .downField("result")
        .downArray
        .downField("earningsTrend")
    )


  implicit def earningsTrendEntityDecoder[F[_]: Sync]: EntityDecoder[F, EarningsTrend] =
    jsonOf[F, EarningsTrend]
}

final case class DefaultKeyStatistics(trailingEps: RawValue)

object DefaultKeyStatistics {
  implicit val decodeDefaultKeyStatistics: Decoder[DefaultKeyStatistics] =
    deriveDecoder[DefaultKeyStatistics].prepare(
      _.downField("quoteSummary")
        .downField("result")
        .downArray
        .downField("defaultKeyStatistics")
    )


  implicit def defaultKeyStatisticsEntityDecoder[F[_]: Sync]: EntityDecoder[F, DefaultKeyStatistics] =
    jsonOf[F, DefaultKeyStatistics]
}

final case class EarningsEstimateError(e: Throwable) extends RuntimeException

