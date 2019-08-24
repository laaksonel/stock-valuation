package io.dontcare.stockvaluation.endpoint

import cats.implicits._
import cats.effect.Sync
import io.dontcare.stockvaluation.api.YahooSuggestionError
import io.dontcare.stockvaluation.api.yahoo.YahooApi
import io.dontcare.stockvaluation.entity._
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl
import io.dontcare.stockvaluation.service.YahooMapper._
import org.http4s.dsl.impl.QueryParamDecoderMatcher

object StockSuggestionRoutes {


  def stockSuggestionRoutes[F[_]: Sync](Y: YahooApi[F]): HttpRoutes[F] = {
    object SearchTermQueryParamMatcher extends QueryParamDecoderMatcher[String]("searchTerm")
    val dsl = new Http4sDsl[F] {}
    import dsl._

    def getStockSuggestions(searchTerm: String) = {
      val result = for {
        suggestions <- Y.getStockSuggestions(searchTerm)
      } yield suggestions

      result.value.flatMap {
        case Right(suggestions) =>
          Ok(suggestions.as[Seq[StockSuggestion]])
        case Left(YahooSuggestionError(msg)) =>
          InternalServerError(msg)
      }
    }

    HttpRoutes.of[F] {
      case GET -> Root / "suggestions" :? SearchTermQueryParamMatcher(searchTerm) =>
        getStockSuggestions(searchTerm)
    }
  }
}
