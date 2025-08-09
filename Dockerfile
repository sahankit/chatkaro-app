# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY client/package*.json ./client/
COPY package*.json ./

# Install dependencies
RUN cd server && npm ci --only=production
RUN cd client && npm ci --only=production

# Copy source code
COPY server/ ./server/
COPY client/ ./client/

# Build the client
RUN cd client && npm run build

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Start the server
CMD ["node", "server/index.js"]
