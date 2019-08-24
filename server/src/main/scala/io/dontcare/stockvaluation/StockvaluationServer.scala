package io.dontcare.stockvaluation

import cats.effect.{ConcurrentEffect, ContextShift, Timer}
import cats.syntax.semigroupk._
import fs2.Stream
import io.dontcare.stockvaluation.api.morningstar.MorningStarApi
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.endpoint.{StockSuggestionRoutes, StockvaluationRoutes}
import org.http4s.client.blaze.BlazeClientBuilder
import org.http4s.implicits._
import org.http4s.server.Router
import org.http4s.server.blaze.BlazeServerBuilder
import org.http4s.server.middleware.Logger

import scala.concurrent.ExecutionContext.global
import scala.util.Try

object StockvaluationServer {

  def stream[F[_]: ConcurrentEffect](implicit T: Timer[F], C: ContextShift[F]): Stream[F, Nothing] = {
    for {
      client <- BlazeClientBuilder[F](global).stream
      morningStarAlg = MorningStarApi.impl[F](client)

      // TODO: Read from configs
      yahooAlg = YahooApi.impl[F](client)

      httpApp = Router(
        "/api" -> (StockvaluationRoutes.stockValueRoutes[F](morningStarAlg, yahooAlg) <+>
                   StockSuggestionRoutes.stockSuggestionRoutes[F](yahooAlg))
      ).orNotFound

      finalHttpApp = Logger.httpApp(logHeaders = true, logBody = true)(httpApp)
      port = Try(sys.env("PORT").toInt)

      exitCode <- BlazeServerBuilder[F]
        .bindHttp(port.getOrElse(8080), "0.0.0.0")
        .withHttpApp(finalHttpApp)
        .serve
    } yield exitCode
  }.drain
}