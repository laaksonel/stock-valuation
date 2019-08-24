package io.dontcare.stockvaluation.endpoint

import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.api.yahoo.entity.StockTimeInterval
import io.dontcare.stockvaluation.entity._
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl
import org.jsoup.Jsoup

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

        // TODO: Unnest this
        fiveYearAveragePE = AverageFiveYearPE(
          Jsoup.parse(htmlContent)
            .select(":matchesOwn(^Price/Earnings$) ~ td:eq(4)")
            .text()
            .toFloat
        )
      } yield StockData(fiveYearAveragePE.value,
                        eps.trailingEps.raw,
                        growthRate.growth.raw,
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