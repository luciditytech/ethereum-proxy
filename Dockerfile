FROM node:11

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install --only=prod

COPY . ./

RUN groupadd -r ethreum-proxy && useradd -r -m -g ethreum-proxy ethreum-proxy
RUN chown -R ethreum-proxy:ethreum-proxy /app

USER ethreum-proxy

CMD [ "npm", "start" ]
