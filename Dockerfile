FROM node:18-alpine as base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

CMD npm run start

EXPOSE 3000
