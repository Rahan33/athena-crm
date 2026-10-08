FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma Query Engine on Alpine
RUN apk add --no-cache openssl

# Copy dependency manifests
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy application source & config
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build optimized production bundle (Vite)
RUN npm run build

# Expose the API and UI port
EXPOSE 4000

# Start the Express server
CMD ["npm", "run", "start"]
