package io.dontcare.stockvaluation.entity

import cats.Applicative
import io.circe.Encoder
import io.circe.generic.semiauto._
import org.http4s.EntityEncoder
import org.http4s.circe._

final case class StockSuggestion(symbol: String,
                                 shortName: String,
                                 longName: Option[String])
object StockSuggestion {
  implicit val stockSuggestionEncode: Encoder[StockSuggestion] =
    deriveEncoder[StockSuggestion]
  implicit def stockSuggestionEntityEncoder[F[_]: Applicative]: EntityEncoder[F, Seq[StockSuggestion]] =
    jsonEncoderOf[F, Seq[StockSuggestion]]
}
