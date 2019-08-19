package io.dontcare.stockvaluation

import cats.effect.{ConcurrentEffect, ContextShift, Timer}
import fs2.Stream
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.endpoint.StockvaluationRoutes
import io.dontcare.stockvaluation.service.StockValuationCalculator
import org.http4s.client.blaze.BlazeClientBuilder
import org.http4s.implicits._
import org.http4s.server.blaze.BlazeServerBuilder
import org.http4s.server.middleware.Logger

import scala.concurrent.ExecutionContext.global

object StockvaluationServer {

  def stream[F[_]: ConcurrentEffect](implicit T: Timer[F], C: ContextShift[F]): Stream[F, Nothing] = {
    for {
      client <- BlazeClientBuilder[F](global).stream
      morningStarAlg = MorningStarApi.impl[F](client)

      // TODO: Read from configs
      yahooAlg = YahooApi.impl[F](client)

      stockValuator = StockValuationCalculator.impl(25f)

      httpApp = StockvaluationRoutes.stockValueRoutes[F](morningStarAlg, yahooAlg, stockValuator).orNotFound

      finalHttpApp = Logger.httpApp(logHeaders = true, logBody = true)(httpApp)

      exitCode <- BlazeServerBuilder[F]
        .bindHttp(sys.env("PORT").toInt, "0.0.0.0")
        .withHttpApp(finalHttpApp)
        .serve
    } yield exitCode
  }.drain
}