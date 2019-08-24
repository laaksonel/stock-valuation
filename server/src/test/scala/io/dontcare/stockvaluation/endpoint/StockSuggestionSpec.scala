package io.dontcare.stockvaluation.endpoint

import cats.effect.IO
import org.http4s.implicits._
import org.http4s.{Method, Request, Response, Status, _}
import org.specs2.matcher.{JsonMatchers, JsonType, Matcher}

class StockSuggestionSpec extends org.specs2.mutable.Specification with JsonMatchers {
  "StockValuation" >> {
    "returns 200" >> {
      suggestionRequest.status must beEqualTo(Status.Ok)
    }

    "returns the suggested companies by search term" >> {
      fetchSuggestions()
    }
  }

  private val suggestionRequest: Response[IO] = {
    val getSuggestions = Request[IO](Method.GET, uri"/suggestions?searchTerm=NVDA")

    StockSuggestionRoutes
      .stockSuggestionRoutes(YahooApiMock.yahooApi)
      .orNotFound(getSuggestions)
      .unsafeRunSync()
  }

  private def fetchSuggestions() = {
    val result = suggestionRequest.as[String].unsafeRunSync()
    result must haveSuggestions(
      suggestionWith("NVDA", "NVIDIA Corporation", "NVIDIA Corporation"),
      suggestionWith("NVDA.MX", "NVIDIA CORP", "NVIDIA Corporation")
    )
  }

  private def haveSuggestions(suggestions: Matcher[String]*) =
    have(allOf(suggestions: _*))

  private def suggestionWith(symbol: Matcher[JsonType],
                             shortName: Matcher[JsonType],
                             longName: Matcher[JsonType]) = {
    /("symbol").andHave(symbol) and
    /("shortName").andHave(shortName) and
    /("longName").andHave(longName)
  }
}
