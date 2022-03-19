# Base layer
FROM node:16-slim AS base
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --newtwork-timeout 600000
COPY . .

# Package install Layer
FROM node:16-slim AS node_modules

WORKDIR /modules

COPY package.json yarn.lock ./
RUN yarn install --non-interactive --frozen-lockfile --production --newtwork-timeout 600000

# Build layer
FROM base AS build
ENV NODE_ENV=production
WORKDIR /build

COPY --from=base /app ./
RUN yarn build

# Production run layer
FROM gcr.io/distroless/nodejs:16
ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock next.config.js ./
COPY --from=build /build/public ./public
COPY --from=build /build/.next ./.next
COPY --from=node_modules /modules/node_modules ./node_modules

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]