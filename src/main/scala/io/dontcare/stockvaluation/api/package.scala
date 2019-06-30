package io.dontcare.stockvaluation

import io.dontcare.stockvaluation.endpoint.StockValuationError
import io.dontcare.stockvaluation.entity.StockTicker

package object api {

  sealed trait ApiError {
    val msg: String
    def asErrorResponse(): StockValuationError = StockValuationError(msg)
  }

  final case class MissingFiveYearEstimate(ticker: StockTicker, msg: String = "Could not find 5-year estimate") extends ApiError
  final case class MissingEarningsPerShare(ticker: StockTicker, msg: String = "Could not find earnings per share") extends ApiError
  final case class MissingAverageFiveYearPE(ticker: StockTicker, msg: String = "Could not find average 5-year PE") extends ApiError
}
