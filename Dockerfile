FROM node:12-alpine

WORKDIR /usr/src/app

# Copies package.json and package-lock.json
COPY package*.json ./ 

# First only install node modules, because if they don't change cached layer can be used
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "server.js"]
