package io.dontcare.stockvaluation

import cats.effect.{ExitCode, IO, IOApp}
import cats.implicits._

object Main extends IOApp {
  def run(args: List[String]) =
    StockvaluationServer.stream[IO].compile.drain.as(ExitCode.Success)
}