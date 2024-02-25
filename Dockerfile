# Base image - Use a lightweight Node.js image
FROM node:lts-alpine

# Working directory within the container
WORKDIR /app

# Copy your package.json and package-lock.json (or yarn.lock) for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of your project files
COPY . .

# Build your Vite project for production
RUN npm run build

# Expose the port your app will listen on
EXPOSE 80 

# Command to start the server 
CMD ["npm", "run", "serve"] 
