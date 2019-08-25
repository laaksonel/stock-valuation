package io.dontcare.stockvaluation.api.yahoo

import cats.data.EitherT
import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api._
import io.dontcare.stockvaluation.api.yahoo.entity.StockTimeInterval.StockTimeInterval
import io.dontcare.stockvaluation.api.yahoo.entity._
import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s.Method._
import org.http4s._
import org.http4s.client.Client
import org.http4s.client.dsl.Http4sClientDsl
import org.http4s.client.middleware.FollowRedirect

trait YahooApi[F[_]] {
  def getEarningsPerShare(ticker: StockTicker): EitherT[F, MissingEarningsPerShare, DefaultKeyStatistics]
  def getExpectedGrowthRate(ticker: StockTicker, timeInterval: StockTimeInterval): EitherT[F, MissingFiveYearEstimate, EarningsEstimate]
  def getStockSuggestions(searchTerm: String): EitherT[F, YahooSuggestionError,YahooSuggestionResponse]
  def getCurrentPrice(ticker: StockTicker): EitherT[F, YahooSummaryError, YahooSummary]
}

object YahooApi {
  def apply[F[_]](implicit ev: YahooApi[F]): YahooApi[F] = ev

  implicit val tickerQueryParam = new QueryParamEncoder[StockTicker] {
    def encode(value: StockTicker): QueryParameterValue = QueryParameterValue(value.ticker)
  }

  def impl[F[_]: Sync](config: YahooConfig, C: Client[F]): YahooApi[F] = new YahooApi[F] {
    private val dsl = new Http4sClientDsl[F]{}
    import dsl._

    def getEarningsPerShare(ticker: StockTicker): EitherT[F, MissingEarningsPerShare, DefaultKeyStatistics] = {
      val defaultKeyStatsUrl = (config.summaryUrl / ticker.toString)
        .withQueryParam("modules", "defaultKeyStatistics")

      EitherT {
        FollowRedirect(1)(C).expect[DefaultKeyStatistics](GET(defaultKeyStatsUrl))
          .map(_.asRight)
      }
    }

    def getExpectedGrowthRate(ticker: StockTicker, timeInterval: StockTimeInterval): EitherT[F, MissingFiveYearEstimate, EarningsEstimate] = {
      val earningsUrl = (config.summaryUrl / ticker.toString)
        .withQueryParam("modules", "earningsTrend")

      EitherT {
        C.expect[EarningsTrend](GET(earningsUrl)).map { r =>
          val matchingInterval = r.trend.find(_.period == timeInterval)
          Either.fromOption(matchingInterval, MissingFiveYearEstimate(ticker))
        }
      }
    }

    def getCurrentPrice(ticker: StockTicker): EitherT[F, YahooSummaryError, YahooSummary] = {
      val priceQuery = config.quoteUrl
        .withQueryParam("symbols", ticker)

      EitherT {
        C.expect[YahooSummary](GET(priceQuery)).map(_.asRight)
      }
    }

    def getStockSuggestions(searchTerm: String): EitherT[F, YahooSuggestionError, YahooSuggestionResponse] = {
      val query = config.suggestionUrl
        .withQueryParam("q", searchTerm)

      EitherT {
        C.expect[YahooSuggestionResponse](GET(query)).map(Right(_))
      }
    }
  }
}
