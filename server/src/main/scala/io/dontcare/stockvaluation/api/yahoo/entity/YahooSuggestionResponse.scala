package io.dontcare.stockvaluation.api.yahoo.entity

object YahooQuoteTypes extends Enumeration {
  type YahooQuoteTypes = Value

  val Equity = Value("EQUITY")
  val StockOption = Value("OPTION")
  val Etf    = Value("ETF")
  val Index  = Value("INDEX")
}

trait YahooApiReponse {
  def error: Option[String]
}

case class YahooQuote(longname: Option[String],
                      quoteType: String,
                      shortname: String,
                      symbol: String)

case class YahooSearchResponse(quotes: Seq[YahooQuote]) {
  def error = Some("Search failed")
  def as[T](implicit f: YahooSearchResponse => T): T = f(this)
}

