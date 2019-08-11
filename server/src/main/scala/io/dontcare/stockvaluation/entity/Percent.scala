package io.dontcare.stockvaluation.entity
import scala.language.implicitConversions

case class Percent(value: Float) extends AnyVal {
  def toDecimal: Float = value / 100f
  def toGrowthDecimal: Float = toDecimal + 1
}

object Percent {
  implicit def toFloat(p: Percent): Float = p.value
  implicit def toPercent(f: Float): Percent = Percent(f)
}
