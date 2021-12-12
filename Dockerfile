FROM node:latest as builder

WORKDIR /build
COPY src/ ./src
COPY *.json ./
RUN npm ci
RUN npm run build

FROM node:latest
WORKDIR /app
COPY --from=builder /build/app ./app
EXPOSE 8081
CMD ["node", "app/index"]
