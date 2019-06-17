# Use the version of node from development to avoid issues later with latest
FROM node:11.12

# you'll likely want the latest npm, regardless of node version, for speed and fixes
# but pin this version for the best stability
RUN npm i npm@latest -g

# install PM2 runtime globally
RUN npm install -g pm2

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app

# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app. 
USER node
COPY package.json yarn.lock* ./
RUN yarn install --no-optional && npm cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s CMD node healthcheck.js

# copy in our source code last, as it changes the most
WORKDIR /opt/node_app/app
COPY . .

# Expose port 5000 to the outside world
EXPOSE 5000

# Execute command to start the app
CMD [ "yarn", "start" ]