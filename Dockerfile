FROM node:14

WORKDIR /usr/src/service
COPY package.json .
RUN npm i -g @angular/cli typescript@~3.8.3
RUN npm i
COPY . .

CMD [ "npm", "run", "dev" ]
