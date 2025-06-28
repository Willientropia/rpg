FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start dev server with correct host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]