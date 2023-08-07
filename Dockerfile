FROM node:alpine
WORKDIR /usr/src/app

RUN npm i -g yarn --force

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn prisma generate
RUN yarn build

EXPOSE 3333
CMD [ "yarn", "start:prod" ]