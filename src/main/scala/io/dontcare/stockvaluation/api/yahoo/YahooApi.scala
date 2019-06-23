package io.dontcare.stockvaluation.api.yahoo

import cats.effect.Sync
import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s.client.Client
import org.http4s.client.dsl.Http4sClientDsl

trait YahooApi[F[_]] {
  def getEarningsPerShare(ticker: StockTicker): F[Float]
  def getExpectedGrowthRate(ticker: StockTicker): F[Float]
}

object YahooApi {
  def apply[F[_]](implicit ev: YahooApi[F]): YahooApi[F] = ev

  def impl[F[_]: Sync](C: Client[F]): YahooApi[F] = new YahooApi[F]{
    val dsl = new Http4sClientDsl[F]{}
    import dsl._
    def getEarningsPerShare(ticker: StockTicker): F[Float] = {
      Sync[F].delay(0f)
    }

    def getExpectedGrowthRate(ticker: StockTicker): F[Float] = {
      Sync[F].delay(0f)
    }
  }
}
