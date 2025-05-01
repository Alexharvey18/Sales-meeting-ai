FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Make sure the standalone HTML file is available and properly named
RUN if [ -f index-standalone.html ]; then echo "Standalone HTML found"; else echo "WARNING: index-standalone.html not found"; fi

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose the port
EXPOSE 10000

# Start the application
CMD ["node", "start-real-server.js"] 