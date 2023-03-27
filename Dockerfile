FROM cypress/browsers:node18.12.0-chrome107

RUN mkdir /ennismore

WORKDIR /ennismore

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

COPY . .

CMD [""]
