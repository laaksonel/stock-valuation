package io.dontcare.stockvaluation.config

import io.dontcare.stockvaluation.api.yahoo.YahooConfig
import pureconfig.generic.auto._

trait ConfigModule {
  import io.dontcare.stockvaluation.util.UriConfigReader._
  lazy val config: Config = pureconfig.loadConfigOrThrow[Config]


}

case class Config(yahoo: YahooConfig)
