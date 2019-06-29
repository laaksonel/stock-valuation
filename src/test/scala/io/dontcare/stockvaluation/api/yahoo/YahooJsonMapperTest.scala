package io.dontcare.stockvaluation.api.yahoo

import cats.effect.IO
import io.circe.parser._
import io.dontcare.stockvaluation.api.yahoo.YahooApi.EarningsEstimate
import org.scalactic.{Equality, TolerantNumerics}
import org.scalatest.{FlatSpec, OptionValues}
import org.scalatest.Matchers._

import scala.io.Source
import scala.util.Try

class YahooJsonMapperTest extends FlatSpec with OptionValues {
  private val epsilon = 1e-3f
  import YahooApi._

  implicit val floatEq: Equality[Float] = TolerantNumerics.tolerantFloatEquality(epsilon)

  "YahooJsonMapperTest" should "parse earnings estimate from JSON" in {
    val result: Option[EarningsEstimate] = for {
      url <- Try(getClass.getResource("/yahoo-earnings-response.json")).toOption
      file = Source.fromURL(url).mkString
      json <- parse(file).toOption
      estimates <- YahooJsonMapper.earningsEstimate(json)
      e <- estimates.headOption
    } yield e

    result.map(_.period) should be (Some(Period.plusFiveYears))
    result
      .map(_.growth)
      .map(_.raw).value should be (0.16f)
  }
}
