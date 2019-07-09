FROM cypress/browsers:chrome69
WORKDIR /cypress_live_stream

COPY package.json .
COPY package-lock.json .
COPY cypress cypress
COPY cypress.json .

ENV CI=1
RUN npm ci

RUN npx cypress verify
