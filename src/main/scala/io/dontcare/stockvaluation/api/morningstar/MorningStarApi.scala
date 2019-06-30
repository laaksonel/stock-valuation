package io.dontcare.stockvaluation.api.morningstar

import cats.data.{EitherT, OptionT}
import cats.Applicative
import cats.data.EitherT
import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.{ApiError, MissingAverageFiveYearPE}
import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s.Method._
import org.http4s._
import org.http4s.client.Client
import org.http4s.client.dsl.Http4sClientDsl

trait MorningStarApi[F[_]] {
  def getCurrentValuationPage(ticker: StockTicker): EitherT[F, MissingAverageFiveYearPE, String]
}

object MorningStarApi {

  def apply[F[_]](implicit ev: MorningStarApi[F]): MorningStarApi[F] = ev

  def impl[F[_]: Sync](C: Client[F]): MorningStarApi[F] = new MorningStarApi[F]{
    val dsl = new Http4sClientDsl[F]{}
    import dsl._

    // TODO: Change this to use JSON API
    // https://api-global.morningstar.com/sal-service/v1/stock/valuation/v3/0P000001R1
    // Before this, it's needed to be figured out where to get the shareClassId
    def getCurrentValuationPage(ticker: StockTicker): EitherT[F, MissingAverageFiveYearPE, String] = {
      // TODO: Move url to config
      val eitherUri = Uri.fromString(s"http://financials.morningstar.com/valuate/current-valuation-list.action?&t=$ticker")

      EitherT {
         eitherUri match {
          case Right(uri) =>
            C.expect[String](GET(uri))
             .map(Right(_))
          case _ =>
            Either.left[MissingAverageFiveYearPE, String](MissingAverageFiveYearPE(ticker))
                  .pure[F]
        }
      }
    }
  }
}
