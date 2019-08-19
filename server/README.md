### Setup Heroku
```
heroku login
heroku stack:set container
```

### Build docker image

```
heroku container:login
sbt docker
docker tag <IMAGE_NAME> registry.heroku.com/<APP_NAME>/web
docker push registry.heroku.com/<APP_NAME>/web
heroku container:release web --app <APP_NAME>
```
