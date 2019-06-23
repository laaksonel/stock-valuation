package io.dontcare.stockvaluation

import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.entity.{AvgFiveYearPE, EarningsPerShare, ExpectedGrowthRate, StockTicker}
import io.dontcare.stockvaluation.service.StockValuationCalculator
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl
import org.jsoup.Jsoup

trait Console[F[_]] {
  def putStrLn(line: String): F[Unit]
}

object StockvaluationRoutes {
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
        for {
          htmlContent <- M.getCurrentValuationPage(ticker)
          eps <- Y.getEarningsPerShare(ticker)
          growthRate <- Y.getExpectedGrowthRate(ticker)
          fiveYearAveragePE = AvgFiveYearPE(Jsoup.parse(htmlContent).select(":containsOwn(Price/Earnings) ~ td:last-child").text().toFloat)
          valuation = stockValuator.priceEarningsMultiple(fiveYearAveragePE, EarningsPerShare(eps), ExpectedGrowthRate(growthRate))
          resp <- Ok(valuation)
        } yield resp
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