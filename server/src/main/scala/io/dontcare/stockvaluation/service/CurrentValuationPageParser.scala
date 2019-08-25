package io.dontcare.stockvaluation.service

import io.dontcare.stockvaluation.entity.AverageFiveYearPE
import org.jsoup.Jsoup

object CurrentValuationPageParser {
  def getAverageFiveYearPE(html: String): AverageFiveYearPE = {
    val averagePE = Jsoup.parse(html)
      .select(":matchesOwn(^Price/Earnings$) ~ td:eq(4)")
      .text()
      .toFloat

    AverageFiveYearPE(averagePE)
  }
}
