package io.dontcare.stockvaluation.api.yahoo

import org.http4s.Uri
import org.http4s.implicits._
import cats.implicits._
import pureconfig.ConfigReader


case class YahooConfig(suggestionUrl: Uri)

