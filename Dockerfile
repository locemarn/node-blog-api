FROM node:slim

RUN apt-get update -y \
  && apt-get install -y openssl

WORKDIR /usr/src/app

COPY packageon package-lockon ./

COPY . .

RUN npm ci

CMD ["sh", "-c", "npm run db:deploy && npm run dev"]
