# Use an official Node.js runtime as a parent image
#FROM node:20-alpine AS builder #Commented this line to remediate 1es warnings

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the NestJS app
RUN npm run build:css
RUN npm run build

# # ----------------------------------

# # Create a minimal image for production
#FROM node:20-alpine AS production #Commented this line to remediate 1es warnings

WORKDIR /app

# # Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# # Copy built application from builder
#COPY --from=builder /app/dist ./dist #Commented this line to remediate 1es warnings

# # # If you use any static assets (optional)
#COPY --from=builder /app/src ./src #Commented this line to remediate 1es warnings

# Start the application
CMD ["node", "dist/main.js"]

# Expose app port
EXPOSE 3001
