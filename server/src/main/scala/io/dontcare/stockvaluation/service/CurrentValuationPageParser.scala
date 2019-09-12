package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.entity.AverageFiveYearPE
import org.jsoup.Jsoup

import scala.util.Try

object CurrentValuationPageParser {
  def getAverageFiveYearPE(html: String): Option[AverageFiveYearPE] = {
    val averagePE = Jsoup.parse(html)
      .select(":matchesOwn(^Price/Earnings$) ~ td:eq(4)")
      .text()

    Try(averagePE.toFloat)
      .map(AverageFiveYearPE)
      .toOption
  }
}
