package io.dontcare.stockvaluation.api.morningstar

import cats.effect._
import io.dontcare.stockvaluation.stock.StockEntity.StockTicker
import org.http4s.Method._
import org.http4s._
import org.http4s.client.Client
import org.http4s.client.dsl.Http4sClientDsl

trait MorningStarApi[F[_]] {
  def getCurrentValuationPage(ticker: StockTicker): F[String]
}

object MorningStarApi {

  def apply[F[_]](implicit ev: MorningStarApi[F]): MorningStarApi[F] = ev

  def impl[F[_]: Sync](C: Client[F]): MorningStarApi[F] = new MorningStarApi[F]{
    val dsl = new Http4sClientDsl[F]{}
    import dsl._
    def getCurrentValuationPage(ticker: StockTicker): F[String] = {
      C.expect[String](GET(uri"http://localhost:8090"))
    }
  }
}
