package io.dontcare.stockvaluation.api.morningstar

import cats.data.EitherT
import cats.effect.Sync
import cats.implicits._
import io.dontcare.stockvaluation.api.MissingAverageFiveYearPE
import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s.Method._
import org.http4s._
import org.http4s.client.Client
import org.http4s.client.dsl.Http4sClientDsl

trait MorningStarApi[F[_]] {
  def getCurrentValuationPage(ticker: StockTicker): EitherT[F, MissingAverageFiveYearPE, String]
}

object MorningStarApi {
  import io.dontcare.stockvaluation.util.HttpUtils.tickerQueryParam

  def apply[F[_]](implicit ev: MorningStarApi[F]): MorningStarApi[F] = ev

  def impl[F[_]: Sync](config: MorningStarConfig, C: Client[F]): MorningStarApi[F] = new MorningStarApi[F]{
    private val dsl = new Http4sClientDsl[F]{}
    import dsl._

    // TODO: Change this to use JSON API
    // https://api-global.morningstar.com/sal-service/v1/stock/valuation/v3/0P000001R1
    // Before this, it's needed to be figured out where to get the shareClassId required by Morningstar API (0P000001R1 in the example URL)
    def getCurrentValuationPage(ticker: StockTicker): EitherT[F, MissingAverageFiveYearPE, String] = {
      val currentValuationUrl = config.currentValuationUrl
        .withQueryParam("t", ticker)

      EitherT {
        C.expect[String](GET(currentValuationUrl)).map(_.asRight)
      }
    }
  }
}
