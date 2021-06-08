FROM node:10-alpine as client_builder
WORKDIR /client
COPY package.json package-lock.json /client/
RUN npm ci
COPY . /client/
RUN npm run doc:build

FROM node:10-alpine as server_builder
WORKDIR /server
COPY server/package.json server/package-lock.json /server/
RUN npm install

FROM node:10-alpine
WORKDIR /app
COPY server/koa.js /app/
COPY --from=client_builder client/.vuepress/dist /app/dist
COPY --from=server_builder server/node_modules /app/node_modules