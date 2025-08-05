FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npx tsc

CMD ["node", "dist/server.js"]