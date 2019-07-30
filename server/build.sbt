val Http4sVersion = "0.20.3"
val CirceVersion = "0.12.0-M2"
val Specs2Version = "4.1.0"
val LogbackVersion = "1.2.3"
val JsoupVersion = "1.12.1"

lazy val root = (project in file("."))
  .settings(
    organization := "io.dontcare",
    name := "stock-valuation",
    version := "0.0.1-SNAPSHOT",
    scalaVersion := "2.12.8",
    scalacOptions ++= Seq("-Ypartial-unification"),
    libraryDependencies ++= Seq(
      "org.http4s"      %% "http4s-blaze-server" % Http4sVersion,
      "org.http4s"      %% "http4s-blaze-client" % Http4sVersion,
      "org.http4s"      %% "http4s-circe"        % Http4sVersion,
      "org.http4s"      %% "http4s-dsl"          % Http4sVersion,
      "io.circe"        %% "circe-generic"       % CirceVersion,
      "io.circe"        %% "circe-parser"        % CirceVersion,
      "ch.qos.logback"  %  "logback-classic"     % LogbackVersion,
      "org.jsoup"       %  "jsoup"               % JsoupVersion,

      "org.specs2"      %% "specs2-core"         % Specs2Version % "test",
      "org.scalactic" %% "scalactic" % "3.0.8",
      "org.scalatest" %% "scalatest" % "3.0.8" % "test"
    ),
    addCompilerPlugin("org.spire-math" %% "kind-projector"     % "0.9.6"),
    addCompilerPlugin("com.olegpy"     %% "better-monadic-for" % "0.2.4")
  )

scalacOptions ++= Seq(
  "-deprecation",
  "-encoding", "UTF-8",
  "-language:higherKinds",
  "-language:postfixOps",
  "-feature",
  "-Ypartial-unification",
  "-Xfatal-warnings",
)