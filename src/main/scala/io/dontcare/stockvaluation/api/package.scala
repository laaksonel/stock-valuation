package io.dontcare.stockvaluation

import io.dontcare.stockvaluation.entity.StockTicker

package object api {
  sealed trait ApiError extends Product with Serializable
  final case class MissingFiveYearEstimate(ticker: StockTicker) extends ApiError
  final case class MissingEarningsPerShare(ticker: StockTicker) extends ApiError
  final case class MissingValuationPage(ticker: StockTicker) extends ApiError
}
