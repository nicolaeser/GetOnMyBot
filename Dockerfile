# Verwende das offizielle Debian 11 als Basisimage
FROM node:20

# Setze das Arbeitsverzeichnis innerhalb des Containers
WORKDIR /usr/src/getonmybot
USER root

COPY package.json ./
COPY ./src ./src
COPY ./prisma ./prisma
RUN npm install
RUN npx prisma generate

CMD ["npm", "run", "start"]
