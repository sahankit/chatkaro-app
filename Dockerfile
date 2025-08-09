# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json
COPY server/package.json ./

# Install dependencies
RUN npm install

# Copy server code
COPY server/ ./

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]