FROM node:20.10-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

COPY /deploy/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

CMD ["/bin/bash", "./entrypoint.sh"]
