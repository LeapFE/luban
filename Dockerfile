FROM node:10-alpine as client_builder
ENV LERNA_PATH=./lerna.json
WORKDIR /client
COPY doc/package.json doc/package-lock.json /client/
RUN npm ci
COPY doc /client/
COPY lerna.json /client/
RUN npm run doc:build

FROM node:10-alpine as server_builder
WORKDIR /server
COPY doc/server/package.json doc/server/package-lock.json /server/
RUN npm install

FROM node:10-alpine
WORKDIR /app
COPY doc/server/package.json /app/
COPY --from=client_builder client/.vuepress/dist /app/dist
COPY --from=server_builder server/node_modules /app/node_modules
