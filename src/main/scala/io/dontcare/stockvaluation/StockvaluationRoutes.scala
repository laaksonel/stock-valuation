package io.dontcare.stockvaluation

import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.entity.StockTicker
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

  def stockValueRoutes[F[_]: Sync](J: Jokes[F], M: MorningStarApi[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._
    HttpRoutes.of[F] {
      case GET -> Root / "morningstar" / ticker =>
        // TODO: Move to service
        for {
          htmlContent <- M.getCurrentValuationPage(ticker.asTicker)
          fiveYearAveragePE = Jsoup.parse(htmlContent).select(":containsOwn(Price/Earnings) ~ td:last-child").text()
          resp <- Ok(fiveYearAveragePE)
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