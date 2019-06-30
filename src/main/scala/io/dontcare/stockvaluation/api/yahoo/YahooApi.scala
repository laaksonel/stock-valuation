package io.dontcare.stockvaluation.api.yahoo

import cats.Applicative
import cats.data.EitherT
import cats.effect.Sync
import cats.implicits._
import io.circe.{Decoder, Encoder, Json}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.dontcare.stockvaluation.api.{MissingEarningsPerShare, MissingFiveYearEstimate}
import io.dontcare.stockvaluation.api.yahoo.Period.Period
import io.dontcare.stockvaluation.api.yahoo.YahooApi.EarningsEstimate
import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s.Method._
import org.http4s._
import org.http4s.circe._
import org.http4s.client.Client
import org.http4s.client.dsl.Http4sClientDsl

object Period extends Enumeration {
    type Period = Value
    val plusFiveYears = Value("+5y")
    val minusFiveYears = Value("-5y")
    val plusOneYear = Value("+1y")
    val plusOneQuarter = Value("+1q")
    val currentQuarter = Value("0q")
    val currentYear = Value("0y")
    val empty = Value("")

  implicit val decodePeriod: Decoder[Period] =
    Decoder.decodeString
      .map { periodStr =>
        Period.values
          .find(_.toString == periodStr)
          .getOrElse(Period.empty)
      }

  implicit val encodeGrowth: Encoder[Period] = new Encoder[Period] {
    override def apply(a: Period): Json = Json.fromString(a.toString)
  }
}

trait YahooApi[F[_]] {
  def getEarningsPerShare(ticker: StockTicker): EitherT[F, MissingEarningsPerShare, Float]
  def getExpectedGrowthRate(ticker: StockTicker): EitherT[F, MissingFiveYearEstimate, EarningsEstimate]
}

object YahooApi {
  def apply[F[_]](implicit ev: YahooApi[F]): YahooApi[F] = ev

  sealed trait YahooStockInformation

  final case class Growth(raw: Float)
  object Growth {
    implicit val decodeGrowth: Decoder[Growth] = deriveDecoder[Growth]
    implicit val encodeGrowth: Encoder[Growth] = deriveEncoder[Growth]
  }

  final case class EarningsEstimate(period: Period, growth: Growth)
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
  import EarningsTrend._

  final case class EarningsEstimateError(e: Throwable) extends RuntimeException

  def impl[F[_]: Sync](C: Client[F]): YahooApi[F] = new YahooApi[F]{
    private val dsl = new Http4sClientDsl[F]{}
    import dsl._

    def getEarningsPerShare(ticker: StockTicker): EitherT[F, MissingEarningsPerShare, Float] = {
      EitherT.liftF(Sync[F].delay(0f))
    }

    def getExpectedGrowthRate(ticker: StockTicker): EitherT[F, MissingFiveYearEstimate, EarningsEstimate] = {
      val eitherUri = Uri.fromString(s"https://query1.finance.yahoo.com/v10/finance/quoteSummary/$ticker?modules=earningsTrend")

      EitherT {
        eitherUri match {
          case Right(uri) =>
            C.expect[EarningsTrend](GET(uri)).map{
              _.trend.find(_.period == Period.plusFiveYears) match {
                case Some(estimate) => Right(estimate)
                case None => Left(MissingFiveYearEstimate(ticker))
              }
            }
          case _ =>
            Either.left[MissingFiveYearEstimate, EarningsEstimate](MissingFiveYearEstimate(ticker))
              .pure[F]
        }
      }
    }
  }
}
