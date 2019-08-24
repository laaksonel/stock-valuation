package io.dontcare.stockvaluation.endpoint

import cats.data.EitherT
import cats.effect.IO
import cats.implicits._
import io.dontcare.stockvaluation.api
import io.dontcare.stockvaluation.api.YahooSummaryError
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.api.yahoo.entity.StockTimeInterval.StockTimeInterval
import io.dontcare.stockvaluation.api.yahoo.entity._
import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s._
import org.http4s.implicits._
import org.specs2.matcher.MatchResult
import org.specs2.matcher.JsonMatchers
import scala.io.Source

class StockValuationSpec extends org.specs2.mutable.Specification with JsonMatchers {

  "StockValuation" >> {
    "returns 200" >> {
      uriReturns200()
    }
    "returns the valuation of the company specified by the ticker" >> {
      fetchStockData()
    }
  }

  private[this] val valuationRequest: Response[IO] = {
    val getValuation = Request[IO](Method.GET, uri"/api/data/NVDA")

    val nvidiaMorningStarPage  = Source.fromURL(getClass.getResource("/morningstar-nvidia-page.html"))

    val morningStarApi = new MorningStarApi[IO] {
      override def getCurrentValuationPage(ticker: StockTicker) = EitherT {
        nvidiaMorningStarPage
          .mkString
          .asRight[api.MissingAverageFiveYearPE]
          .pure[IO]
      }
    }

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
        val response = YahooQuote(
          Some("NVIDIA Corporation"),
          "EQUITY",
          "NVIDIA Corporation",
          "NVDA"
        )

        response.asRight[api.YahooSuggestionError]
                .map(Seq(_))
                .map(YahooSuggestionResponse(_))
                .pure[IO]
      }
    }

    StockvaluationRoutes.stockValueRoutes(morningStarApi, yahooApi).orNotFound(getValuation).unsafeRunSync()
  }

  private[this] def uriReturns200(): MatchResult[Status] =
    valuationRequest.status must beEqualTo(Status.Ok)

  private[this] def fetchStockData(): MatchResult[String] = {
    val result = valuationRequest.as[String].unsafeRunSync()

    result must /("averageFiveYearPE" -> 34.5)
    result must /("eps" -> 5.298)
    result must /("expectedGrowthRatePercent" -> 0.125)
    result must /("currentPrice" -> 100.0)
  }
}