FROM node:latest

WORKDIR /app/src/
COPY package*.json ./
COPY . .

RUN npm install 
ENTRYPOINT ["node", "/app/src/index.js"]

EXPOSE 80