FROM aksocstgacr.azurecr.io/onecloud-base:v1 AS build

# Set the working directory
WORKDIR /app

# Give ownership of the working directory to the user and group
RUN chown -R onecloud:onecloud /app
RUN chmod -R 777 /app 

COPY package.json ./
#COPY .npmrc ./
RUN npm install

COPY . .

# Build the production bundle
RUN npm run build

############################################################################
FROM aksocstgacr.azurecr.io/onecloud-base:v2 AS serve

# Set working directory inside the container
WORKDIR /app

# Copy the production bundle from the build stage
COPY --from=build /app/dist .

# Install serve globally
#RUN npm install -g serve

# Give ownership of the working directory to the user and group
RUN chown -R onecloud:onecloud /app
RUN chmod -R 777 /app 

# Change to the non-root user
USER onecloud

EXPOSE 8080
# Command to start the production server
CMD ["serve", "-s", ".", "-l", "8080"]
