package io.dontcare.stockvaluation.api.yahoo.entity

import cats.effect.Sync
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}
import org.http4s.EntityDecoder
import org.http4s.circe._

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

object YahooQuote {
  implicit val decodeYahooQuote: Decoder[YahooQuote] = deriveDecoder[YahooQuote]
}

case class YahooSuggestionResponse(quotes: Seq[YahooQuote]) {
  def as[T](implicit f: YahooSuggestionResponse => T): T = f(this)
}

object YahooSuggestionResponse {
  implicit val decodeStockSuggestion: Decoder[YahooSuggestionResponse] = deriveDecoder[YahooSuggestionResponse]

  implicit def stockSuggestionEntityDecoder[F[_]: Sync]: EntityDecoder[F, YahooSuggestionResponse] =
    jsonOf[F, YahooSuggestionResponse]
}
