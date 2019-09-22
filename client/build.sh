#!/bin/bash

yarn run build --production
docker build -t stock-client .