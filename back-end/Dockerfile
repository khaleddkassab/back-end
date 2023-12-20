# Use the specified Node.js version
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the .env file into the container
COPY .env .env

# Define build-time variables with default values
ARG PORT
ARG MONGODB_URI
ARG ANGULAR_URI
ARG ANGULAR_PORT
# Set environment variables for runtime
ENV PORT=$PORT
ENV MONGODB_URI=$MONGODB_URI
ENV ANGULAR_URI=$ANGULAR_URI
ENV ANGULAR_PORT=$ANGULAR_PORT
# Expose the app's port (optional, doesn't actually publish the port)
EXPOSE $PORT

# Command to run your application
CMD ["node", "app.js"]
