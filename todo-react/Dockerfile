FROM node:18-alpine AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS backend
WORKDIR /Server
COPY Server/package*.json ./
RUN npm install
COPY --from=frontend /app/dist ./build
COPY Server/index.js ./
EXPOSE 5000

CMD ["node", "index.js"]
