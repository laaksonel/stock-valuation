package io.dontcare.stockvaluation.api.yahoo

import org.http4s.Uri

case class YahooConfig(suggestionUrl: Uri,
                       quoteUrl: Uri,
                       summaryUrl: Uri)

