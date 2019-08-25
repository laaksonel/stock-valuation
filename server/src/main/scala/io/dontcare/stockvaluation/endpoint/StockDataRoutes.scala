package io.dontcare.stockvaluation.endpoint

import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.api.yahoo.entity.StockTimeInterval
import io.dontcare.stockvaluation.entity._
import io.dontcare.stockvaluation.service.CurrentValuationPageParser
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl

sealed trait HttpResponse
final case class StockValuationError(msg: String) extends HttpResponse

object StockvaluationRoutes {

  def stockValueRoutes[F[_]: Sync](M: MorningStarApi[F],
                                   Y: YahooApi[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}

    import StockTicker._
    import dsl._

    def getStockData(ticker: StockTicker) = {
      val result = for {
        // TODO: Cache the external values
        growthRate   <- Y.getExpectedGrowthRate(ticker, StockTimeInterval.plusFiveYears).leftMap(_.asErrorResponse())
        htmlContent  <- M.getCurrentValuationPage(ticker).leftMap(_.asErrorResponse())
        eps          <- Y.getEarningsPerShare(ticker).leftMap(_.asErrorResponse())
        currentPrice <- Y.getCurrentPrice(ticker).leftMap(_.asErrorResponse())

        fiveYearAveragePE = CurrentValuationPageParser.getAverageFiveYearPE(htmlContent)
      } yield StockData(fiveYearAveragePE,
                        eps.trailingEps,
                        growthRate.growth,
                        currentPrice.regularMarketPrice)

      result.value.flatMap {
        case Right(valuation) => Ok(valuation)
        case Left(StockValuationError(msg)) =>
          InternalServerError(msg)
      }
    }

    HttpRoutes.of[F] {
      case GET -> Root / "data" / stockTicker =>
        getStockData(stockTicker.asTicker)
    }
  }
}