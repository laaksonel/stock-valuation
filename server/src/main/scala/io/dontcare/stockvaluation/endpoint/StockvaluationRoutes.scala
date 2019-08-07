package io.dontcare.stockvaluation.endpoint

import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.entity._
import io.dontcare.stockvaluation.service.StockValuationCalculator
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl
import org.http4s.dsl.impl.QueryParamDecoderMatcher
import org.jsoup.Jsoup

trait Console[F[_]] {
  def putStrLn(line: String): F[Unit]
}

object StockvaluationRoutes {
  implicit class StringTicker(val value: String) extends AnyVal {
    def asTicker: StockTicker = StockTicker(value)
  }

  def stockValueRoutes[F[_]: Sync](M: MorningStarApi[F], Y: YahooApi[F], stockValuator: StockValuationCalculator): HttpRoutes[F] = {
    import io.dontcare.stockvaluation.service.YahooMapper._
    object SearchTermQueryParamMatcher extends QueryParamDecoderMatcher[String]("searchTerm")
    val dsl = new Http4sDsl[F]{}
    import dsl._

    HttpRoutes.of[F] {
      case GET -> Root / "api" / "suggestions" :? SearchTermQueryParamMatcher(searchTerm) =>
        val result = for {
          suggestions <- Y.getStockSuggestions(searchTerm)
        } yield suggestions

        result.value.flatMap {
          case Right(valuation) => Ok(valuation.as[Seq[StockSuggestion]])
          case Left(StockValuationError(msg)) => {
            println(s"Message: $msg")
            InternalServerError(msg)
          }
        }
      case GET -> Root / "valuation" / stockTicker =>
        // TODO: Move to service
        val ticker = stockTicker.asTicker

        val result = for {

          // TODO: Cache the external values
          growthRate <- Y.getExpectedGrowthRate(ticker).leftMap(_.asErrorResponse())
          htmlContent <- M.getCurrentValuationPage(ticker).leftMap(_.asErrorResponse())
          eps <- Y.getEarningsPerShare(ticker).leftMap(_.asErrorResponse())

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
          case Left(StockValuationError(msg)) => {
            println(s"Message: $msg")
            InternalServerError(msg)
          }
        }
    }
  }
}