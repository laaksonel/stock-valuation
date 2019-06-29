package io.dontcare.stockvaluation.api.morningstar

import cats.data.EitherT
import cats.effect._
import cats.implicits._
import io.dontcare.stockvaluation.api.MissingValuationPage
import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s.Method._
import org.http4s._
import org.http4s.client.Client
import org.http4s.client.dsl.Http4sClientDsl

trait MorningStarApi[F[_]] {
  def getCurrentValuationPage(ticker: StockTicker): EitherT[F, MissingValuationPage.type, String]
}

object MorningStarApi {

  def apply[F[_]](implicit ev: MorningStarApi[F]): MorningStarApi[F] = ev

  def impl[F[_]: Sync](C: Client[F]): MorningStarApi[F] = new MorningStarApi[F]{
    val dsl = new Http4sClientDsl[F]{}
    import dsl._
    def getCurrentValuationPage(ticker: StockTicker): EitherT[F, MissingValuationPage.type, String] = {
      // TODO: Move url to config
      val result = C.expect[String](GET(uri"http://localhost:8090"))
          .map(Option(_).filter(_.trim.nonEmpty))

      EitherT.fromOptionF(result, MissingValuationPage)
//      result.pure[EitherT[F, MissingValuationPage, String]]
    }
  }
}
