package io.dontcare.stockvaluation.api.yahoo

import cats.data.EitherT
import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.yahoo.entity.StockTimeInterval.StockTimeInterval
import io.dontcare.stockvaluation.api.yahoo.entity._
import io.dontcare.stockvaluation.api.{MissingEarningsPerShare, MissingFiveYearEstimate}
import io.dontcare.stockvaluation.endpoint.StockValuationError
import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s.Method._
import org.http4s._
import org.http4s.client.Client
import org.http4s.client.dsl.Http4sClientDsl
import org.http4s.client.middleware.FollowRedirect

trait YahooApi[F[_]] {
  def getEarningsPerShare(ticker: StockTicker): EitherT[F, MissingEarningsPerShare, DefaultKeyStatistics]
  def getExpectedGrowthRate(ticker: StockTicker, timeInterval: StockTimeInterval): EitherT[F, MissingFiveYearEstimate, EarningsEstimate]
  def getStockSuggestions(searchTerm: String): EitherT[F, StockValuationError,YahooSearchResponse]
}

object YahooApi {
  def apply[F[_]](implicit ev: YahooApi[F]): YahooApi[F] = ev

  def impl[F[_]: Sync](C: Client[F]): YahooApi[F] = new YahooApi[F]{
    private val dsl = new Http4sClientDsl[F]{}
    import dsl._

    def getEarningsPerShare(ticker: StockTicker): EitherT[F, MissingEarningsPerShare, DefaultKeyStatistics] = {
      val tickerUrl = Uri.fromString(s"http://query1.finance.yahoo.com/v10/finance/quoteSummary/$ticker?modules=defaultKeyStatistics")

      EitherT {
        tickerUrl match {
          case Right(uri) =>
            FollowRedirect(1)(C).expect[DefaultKeyStatistics](GET(uri))
              .map(Right(_))
          case _ =>
            Either.left[MissingEarningsPerShare, DefaultKeyStatistics](MissingEarningsPerShare(ticker))
              .pure[F]
        }
      }
    }

    def getExpectedGrowthRate(ticker: StockTicker, timeInterval: StockTimeInterval): EitherT[F, MissingFiveYearEstimate, EarningsEstimate] = {
      val tickerUrl = Uri.fromString(s"https://query1.finance.yahoo.com/v10/finance/quoteSummary/$ticker?modules=earningsTrend")

      EitherT {
        tickerUrl match {
          case Right(uri) =>
            C.expect[EarningsTrend](GET(uri)).map {
              _.trend.find(_.period == timeInterval) match {
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

    def getStockSuggestions(searchTerm: String): EitherT[F, StockValuationError,YahooSearchResponse] = {
      EitherT.liftF(Sync[F].delay(
        YahooSearchResponse(Seq(YahooQuote(Some("NVIDIA LONG"), "EQUITY", "NVIDIA SHORT", "NVDA")))
      ))
    }
  }
}
