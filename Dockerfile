FROM node:latest as builder

WORKDIR /build
COPY src/ ./src
COPY *.json ./
RUN npm ci
RUN npm run build

FROM node:latest
COPY --from=builder /build/app ./app
COPY *.json ./
EXPOSE 8081
CMD ["node", "app/index"]
