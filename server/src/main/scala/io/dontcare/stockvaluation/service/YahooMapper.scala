package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.api.yahoo.entity.YahooQuoteTypes._
import io.dontcare.stockvaluation.api.yahoo.entity.YahooSuggestionResponse
import io.dontcare.stockvaluation.entity.StockSuggestion

object YahooMapper {

  implicit def toStockSuggestionResponse: YahooSuggestionResponse => Seq[StockSuggestion] =
    _.quotes
     .filter(q => withName(q.quoteType) == Equity)
     .map { q =>
       StockSuggestion(q.symbol, q.shortname, q.longname)
     }
}
