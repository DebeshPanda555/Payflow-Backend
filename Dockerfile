FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy sources
COPY . .

# Generate Prisma schemas targeted perfectly for Alpine WASM compilation
RUN npx prisma generate

# Build TypeScript target natively
RUN npm run build

# Use unprivileged profile
USER node

EXPOSE 5001

# Trigger runtime execution
CMD ["npm", "start"]
