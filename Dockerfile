# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:22-alpine3.22

# Create app directory (where your app will be placed)
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Build the Next.js app
RUN npm run build

# App binds to port 3001 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3001

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "start" ]