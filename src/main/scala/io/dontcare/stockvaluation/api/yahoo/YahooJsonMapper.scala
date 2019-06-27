package io.dontcare.stockvaluation.api.yahoo

import io.circe.{Decoder, Json}
import io.dontcare.stockvaluation.api.yahoo.Period.Period

object YahooJsonMapper {
  implicit val decodeGrowth: Decoder[Growth] =
    Decoder.forProduct1("raw")(Growth.apply)


  implicit val decodePeriod: Decoder[Period] =
    Decoder.decodeString
      .map { periodStr =>
        Period.values
          .find(_.toString == periodStr)
          .getOrElse(Period.empty)
      }

  implicit val decodeEarningsEstimate: Decoder[EarningsEstimate] =
    Decoder.forProduct2("period", "growth")(EarningsEstimate.apply)


  def earningsEstimate(json: Json): Option[EarningsEstimate] = {
    json.hcursor
        .downField("quoteSummary")
        .downField("result")
        .downArray
        .downField("earningsTrend")
        .downField("trend")
        .focus
        .flatMap(_.asArray)
        .getOrElse(Vector.empty)
        .flatMap(_.as[EarningsEstimate].toOption)
        .find(_.period == Period.plusFiveYears)
  }
}
