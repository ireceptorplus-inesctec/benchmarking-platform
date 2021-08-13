FROM node:14 AS node_base

RUN echo "NODE Version:" && node --version
RUN echo "NPM Version:" && npm --version

FROM docker:dind


COPY --from=node_base . .

WORKDIR /usr/src/service
COPY package.json .
RUN npm i -g @angular/cli typescript@~3.8.3
RUN npm i
COPY . .
RUN mv .env.example .env

CMD [ "npm", "run", "dev" ]
