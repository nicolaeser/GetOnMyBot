#!/bin/bash
ls -a
docker-compose pull
docker system prune -f
docker-compose up -d