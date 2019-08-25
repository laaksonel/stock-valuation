val Http4sVersion = "0.20.3"
val CirceVersion = "0.12.0-M2"
val Specs2Version = "4.7.0"
val LogbackVersion = "1.2.3"
val JsoupVersion = "1.12.1"
val PureConfigVersion = "0.11.1"
val ScalaLoggingVersion = "3.9.2"

lazy val root = (project in file("."))
  .settings(
    organization := "io.dontcare",
    name := "stock-valuation",
    version := "0.0.1-SNAPSHOT",
    scalaVersion := "2.12.8",
    scalacOptions ++= Seq("-Ypartial-unification"),
    libraryDependencies ++= Seq(
      "org.http4s"                  %% "http4s-blaze-server" % Http4sVersion,
      "org.http4s"                  %% "http4s-blaze-client" % Http4sVersion,
      "org.http4s"                  %% "http4s-circe"        % Http4sVersion,
      "org.http4s"                  %% "http4s-dsl"          % Http4sVersion,
      "io.circe"                    %% "circe-generic"       % CirceVersion,
      "io.circe"                    %% "circe-parser"        % CirceVersion,
      "ch.qos.logback"              %  "logback-classic"     % LogbackVersion,
      "com.github.pureconfig"       %% "pureconfig"          % PureConfigVersion,
      "org.jsoup"                   %  "jsoup"               % JsoupVersion,
      "com.typesafe.scala-logging"  %% "scala-logging"       % ScalaLoggingVersion,

      "org.specs2"      %% "specs2-core"         % Specs2Version % "test",
      "org.specs2"      %% "specs2-matcher-extra"% Specs2Version % "test",
      "org.scalactic" %% "scalactic" % "3.0.8"                   % "test",
      "org.scalatest" %% "scalatest" % "3.0.8"                   % "test"
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

enablePlugins(sbtdocker.DockerPlugin, JavaAppPackaging)

dockerfile in docker := {
  val appDir: File = stage.value
  val targetDir = "/app"

  new Dockerfile {
//    expose(8080)

    from("openjdk:8-jre")
    copy(appDir, targetDir, chown = "daemon:daemon")
    cmd(s"$targetDir/bin/${executableScriptName.value}")
  }
}

imageNames in docker := Seq(
  // Sets the latest tag
  ImageName(s"${organization.value}/${name.value}:latest"),

  ImageName(
    namespace = Some(organization.value),
    repository = name.value,
    tag = Some("v" + version.value)
  )
)
