# Stage 1: Development
FROM node:16-alpine as development

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock first (to optimize layer caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the rest of the application
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Run the application in development mode
CMD ["yarn", "start:dev"]
