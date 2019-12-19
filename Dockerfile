FROM node:13

# set timezone
ENV TZ Europe/Berlin

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

ARG API_KEY_MC
ARG IMAGE_VERSION
ENV API_KEY_METACRITIC=$API_KEY_MC
ENV IMAGE_VERSION=$GITHUB_SHA

#EXPOSE 8080
CMD [ "npm", "start" ]
