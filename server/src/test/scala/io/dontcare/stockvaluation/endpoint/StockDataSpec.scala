package io.dontcare.stockvaluation.endpoint

import cats.data.EitherT
import cats.effect.IO
import cats.implicits._
import io.dontcare.stockvaluation.api
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s._
import org.http4s.implicits._
import org.specs2.matcher.{JsonMatchers, MatchResult}
import org.specs2.mutable.Specification

import scala.io.Source

class StockDataSpec extends Specification with JsonMatchers {

  "StockData" >> {
    "returns 200" >> {
      dataRequest.status must beEqualTo(Status.Ok)
    }
    "returns the data of the stock specified by the ticker" >> {
      fetchStockData()
    }
  }

  private val dataRequest: Response[IO] = {
    val getStockData = Request[IO](Method.GET, uri"/data/NVDA")

    val nvidiaMorningStarPage = Source.fromURL(getClass.getResource("/morningstar-nvidia-page.html"))

    val morningStarApi = new MorningStarApi[IO] {
      override def getCurrentValuationPage(ticker: StockTicker) = EitherT {
        nvidiaMorningStarPage
          .mkString
          .asRight[api.MissingAverageFiveYearPE]
          .pure[IO]
      }
    }

    StockvaluationRoutes.stockValueRoutes(morningStarApi, YahooApiMock.yahooApi)
      .orNotFound(getStockData)
      .unsafeRunSync()
  }

  private def fetchStockData(): MatchResult[String] = {
    val result = dataRequest.as[String].unsafeRunSync()

    result must /("averageFiveYearPE" -> 34.5)
    result must /("eps" -> 5.298)
    result must /("expectedGrowthRatePercent" -> 0.125)
    result must /("currentPrice" -> 100.0)
  }
}