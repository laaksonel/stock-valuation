package io.dontcare.stockvaluation.util

import org.http4s.Uri
import pureconfig.ConfigReader
import pureconfig.error.CannotConvert

object UriConfigReader {
  implicit val uriConfigReader: ConfigReader[Uri] = ConfigReader.fromString[Uri] { str =>
    Uri.fromString(str).left.map(e => CannotConvert(str, "Uri", e.message))
  }
}

