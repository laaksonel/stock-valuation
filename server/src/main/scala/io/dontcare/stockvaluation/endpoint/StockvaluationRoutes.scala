package io.dontcare.stockvaluation.endpoint

import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.YahooSuggestionError
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.api.yahoo.entity.StockTimeInterval
import io.dontcare.stockvaluation.entity._
import io.dontcare.stockvaluation.service.StockValuationCalculator
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl
import org.http4s.dsl.impl.QueryParamDecoderMatcher
import org.jsoup.Jsoup

sealed trait HttpResponse
final case class StockValuationError(msg: String) extends HttpResponse

object StockvaluationRoutes {

  def stockValueRoutes[F[_]: Sync](M: MorningStarApi[F],
                                   Y: YahooApi[F],
                                   stockValuator: StockValuationCalculator): HttpRoutes[F] = {
    object SearchTermQueryParamMatcher extends QueryParamDecoderMatcher[String]("searchTerm")
    val dsl = new Http4sDsl[F]{}

    import StockTicker._
    import dsl._
    import io.dontcare.stockvaluation.service.YahooMapper._

    def getStockValuation(ticker: StockTicker) = {
      val result = for {
        // TODO: Cache the external values
        growthRate  <- Y.getExpectedGrowthRate(ticker, StockTimeInterval.plusFiveYears).leftMap(_.asErrorResponse())
        htmlContent <- M.getCurrentValuationPage(ticker).leftMap(_.asErrorResponse())
        eps         <- Y.getEarningsPerShare(ticker).leftMap(_.asErrorResponse())

        fiveYearAveragePE = AverageFiveYearPE(
          Jsoup.parse(htmlContent)
            .select(":matchesOwn(^Price/Earnings$) ~ td:eq(4)")
            .text()
            .toFloat
        )

        valuation = stockValuator.priceEarningsMultiple(
          fiveYearAveragePE,
          EarningsPerShare(eps.trailingEps.raw),
          ExpectedGrowthRatePercent(growthRate.growth.raw)
        )
      } yield valuation

      result.value.flatMap {
        case Right(valuation) => Ok(valuation)
        case Left(StockValuationError(msg)) =>
          InternalServerError(msg)
      }
    }

    def getStockSuggestions(searchTerm: String) = {
      val result = for {
        suggestions <- Y.getStockSuggestions(searchTerm)
      } yield suggestions

      result.value.flatMap {
        case Right(valuation) =>
          Ok(valuation.as[Seq[StockSuggestion]])
        case Left(YahooSuggestionError(msg)) =>
          InternalServerError(msg)
      }
    }

    HttpRoutes.of[F] {
      case GET -> Root / "api" / "suggestions" :? SearchTermQueryParamMatcher(searchTerm) =>
        getStockSuggestions(searchTerm)
      case GET -> Root / "api" / "valuation" / stockTicker =>
        getStockValuation(stockTicker.asTicker)
    }
  }
}