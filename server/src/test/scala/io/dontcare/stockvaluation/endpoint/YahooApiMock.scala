package io.dontcare.stockvaluation.endpoint

import cats.data.EitherT
import cats.effect.IO
import cats.implicits._
import io.dontcare.stockvaluation.api
import io.dontcare.stockvaluation.api.YahooSummaryError
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.api.yahoo.entity.StockTimeInterval.StockTimeInterval
import io.dontcare.stockvaluation.api.yahoo.entity._
import io.dontcare.stockvaluation.entity.StockTicker

object YahooApiMock {

  val yahooApi = new YahooApi[IO] {
    override def getEarningsPerShare(ticker: StockTicker) = EitherT {
      DefaultKeyStatistics(RawValue(5.298f))
        .asRight[api.MissingEarningsPerShare]
        .pure[IO]
    }

    override def getExpectedGrowthRate(ticker: StockTicker, timeInterval: StockTimeInterval) = EitherT {
      EarningsEstimate(timeInterval, RawValue(0.125f))
        .asRight[api.MissingFiveYearEstimate]
        .pure[IO]
    }

    override def getCurrentPrice(ticker: StockTicker) = EitherT {
      YahooSummary(100.0f)
        .asRight[YahooSummaryError]
        .pure[IO]
    }

    override def getStockSuggestions(searchTerm: String): EitherT[IO, api.YahooSuggestionError, YahooSuggestionResponse] = EitherT {
      val response = Seq(
        YahooQuote(
          Some("NVIDIA Corporation"),
          YahooQuoteTypes.Equity.toString,
          "NVIDIA Corporation",
          "NVDA"
        ),
        YahooQuote(
          Some("NVIDIA Corporation"),
          YahooQuoteTypes.Equity.toString,
          "NVIDIA CORP",
          "NVDA.MX",
        )
      )

      response.asRight[api.YahooSuggestionError]
        .map(YahooSuggestionResponse(_))
        .pure[IO]
    }
  }
}
