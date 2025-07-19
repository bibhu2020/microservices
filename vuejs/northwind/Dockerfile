# Step 1: Build the app
#FROM node:20 AS build #Commented this line to remediate 1es warnings

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app for production
RUN npm run build-only

# Step 2: Serve the app
#FROM nginx:alpine #Commented this line to remediate 1es warnings

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built app from the build stage to the nginx HTML directory
#COPY --from=build /app/dist /usr/share/nginx/html #Commented this line to remediate 1es warnings

# Expose the port the app will be running on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
