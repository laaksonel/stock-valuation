package io.dontcare.stockvaluation.config

import io.dontcare.stockvaluation.api.yahoo.YahooConfig
import com.typesafe.scalalogging.StrictLogging
import io.dontcare.stockvaluation.api.morningstar.MorningStarConfig
import pureconfig.generic.auto._

trait ConfigModule extends StrictLogging {
  import io.dontcare.stockvaluation.util.UriConfigReader._
  lazy val config: Config = pureconfig.loadConfigOrThrow[Config]

  def logConfig(): Unit = {
    val baseInfo =
      s"""
         |Configuration:
         |-----------------------
         |MorningStarApi: ${config.morningstar}
         |YahooApi:       ${config.yahoo}
         |""".stripMargin

    logger.info(baseInfo)
  }

}

case class Config(yahoo: YahooConfig, morningstar: MorningStarConfig)
