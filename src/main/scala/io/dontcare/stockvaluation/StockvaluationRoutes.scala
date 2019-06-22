package io.dontcare.stockvaluation

import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl

trait Console[F[_]] {
  def putStrLn(line: String): F[Unit]
}

object StockvaluationRoutes {
  def jokeRoutes[F[_]: Sync](J: Jokes[F], M: MorningStarApi[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._
    HttpRoutes.of[F] {
      case GET -> Root / "morningstar" / ticker =>
        for {
          htmlContent <- M.getCurrentValuationPage(ticker)
          resp <- Ok(htmlContent)
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