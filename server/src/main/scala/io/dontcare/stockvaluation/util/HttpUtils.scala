package io.dontcare.stockvaluation.util

import io.dontcare.stockvaluation.entity.StockTicker
import org.http4s.{QueryParamEncoder, QueryParameterValue}

object HttpUtils {
  implicit val tickerQueryParam = new QueryParamEncoder[StockTicker] {
    def encode(value: StockTicker): QueryParameterValue = QueryParameterValue(value.ticker)
  }
}
