FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

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
