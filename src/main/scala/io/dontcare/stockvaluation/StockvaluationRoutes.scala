package io.dontcare.stockvaluation

import cats.data.OptionT
import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.{MissingEarningsPerShare, MissingFiveYearEstimate, MissingValuationPage}
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.entity.{AvgFiveYearPE, EarningsPerShare, ExpectedGrowthRate, StockTicker}
import io.dontcare.stockvaluation.service.StockValuationCalculator
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl
import org.jsoup.Jsoup
import io.circe.syntax._

trait Console[F[_]] {
  def putStrLn(line: String): F[Unit]
}

object StockvaluationRoutes {
  import YahooApi.EarningsEstimate._
  implicit class StringTicker(val value: String) extends AnyVal {
    def asTicker: StockTicker = StockTicker(value)
  }

  def stockValueRoutes[F[_]: Sync](M: MorningStarApi[F], Y: YahooApi[F], stockValuator: StockValuationCalculator): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._
    HttpRoutes.of[F] {
      case GET -> Root / "morningstar" / stockTicker =>
        // TODO: Move to service
        val ticker = stockTicker.asTicker
        val valuation = for {
          growthRate <- Y.getExpectedGrowthRate(ticker)
//          htmlContent <- M.getCurrentValuationPage(ticker)
//          eps <- Y.getEarningsPerShare(ticker)

//          fiveYearAveragePE = AvgFiveYearPE(Jsoup.parse(htmlContent).select(":containsOwn(Price/Earnings) ~ td:last-child").text().toFloat)
//          valuation = stockValuator.priceEarningsMultiple(fiveYearAveragePE, EarningsPerShare(eps), ExpectedGrowthRate(growthRate.growth.raw))
//          valuation = 123
//          resp <- Ok(valuation)
        } yield growthRate

        valuation.value.flatMap {
          case Right(result) => Ok(result)
          case Left(MissingFiveYearEstimate(_)) => BadRequest("Five year")
//          case Left(MissingValuationPage(_)) => BadRequest("Valuation")
//          case Left(MissingEarningsPerShare(_)) => BadRequest("Earnings")
        }
    }
  }

//  def helloWorldRoutes[F[_]: Sync](H: HelloWorld[F]): HttpRoutes[F] = {
//    val dsl = new Http4sDsl[F]{}
//    import dsl._
//    HttpRoutes.of[F] {
//      case GET -> Root / "hello" / name =>
//        for {
//          greeting <- H.hello(HelloWorld.Name(name))
//          resp <- Ok(greeting)
//        } yield resp
//    }
//  }
}