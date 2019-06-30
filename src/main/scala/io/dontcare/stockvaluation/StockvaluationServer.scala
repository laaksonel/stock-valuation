package io.dontcare.stockvaluation

import cats.effect.{ConcurrentEffect, ContextShift, IO, Timer}
import cats.implicits._
import fs2.Stream
import org.http4s.client.blaze.BlazeClientBuilder
import org.http4s.implicits._
import org.http4s.server.blaze.BlazeServerBuilder
import org.http4s.server.middleware.Logger
import fs2.Stream
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.endpoint.StockvaluationRoutes
import io.dontcare.stockvaluation.entity.StockTicker
import io.dontcare.stockvaluation.service.StockValuationCalculator
import org.http4s.Uri

import scala.concurrent.ExecutionContext.global

object StockvaluationServer {

  def stream[F[_]: ConcurrentEffect](implicit T: Timer[F], C: ContextShift[F]): Stream[F, Nothing] = {
    for {
      client <- BlazeClientBuilder[F](global).stream
      helloWorldAlg = HelloWorld.impl[F]
      jokeAlg = Jokes.impl[F](client)
      morningStarAlg = MorningStarApi.impl[F](client)

      // TODO: Read from configs
      yahooAlg = YahooApi.impl[F](client)

      stockValuator = StockValuationCalculator.impl(7.5f)

      httpApp = StockvaluationRoutes.stockValueRoutes[F](morningStarAlg, yahooAlg, stockValuator).orNotFound

      finalHttpApp = Logger.httpApp(true, true)(httpApp)

      exitCode <- BlazeServerBuilder[F]
        .bindHttp(8080, "0.0.0.0")
        .withHttpApp(finalHttpApp)
        .serve
    } yield exitCode
  }.drain
}