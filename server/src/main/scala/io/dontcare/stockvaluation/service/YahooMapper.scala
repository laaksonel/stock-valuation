package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.api.yahoo.entity.YahooSearchResponse
import io.dontcare.stockvaluation.entity.StockSuggestion
import io.dontcare.stockvaluation.api.yahoo.entity.YahooQuoteTypes._

object YahooMapper {

  implicit def toStockSuggestionResponse: YahooSearchResponse => Seq[StockSuggestion] = (response: YahooSearchResponse) => {
    val suggestions = response.quotes
      .filter(x => withName(x.quoteType) == Equity)
      .map { q =>
        StockSuggestion(q.symbol, q.shortname, q.longname)
      }

    suggestions
  }
}
