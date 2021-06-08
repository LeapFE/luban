FROM node:10-alpine
WORKDIR /client
COPY package.json package-lock.json /client/
RUN npm ci
COPY . /client/
RUN npm run doc:build