package io.dontcare.stockvaluation.endpoint

sealed trait HttpResponse

final case class StockValuationError(msg: String) extends HttpResponse

