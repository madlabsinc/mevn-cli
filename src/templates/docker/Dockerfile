FROM node:12.16.0-buster

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "serve" ]
