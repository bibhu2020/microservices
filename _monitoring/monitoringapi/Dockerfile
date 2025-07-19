FROM aksocstgacr.azurecr.io/onecloud-base:v1

# Set the working directory
WORKDIR /app

# Give ownership of the working directory to the user and group
RUN chown -R onecloud:onecloud /app
RUN chmod -R 777 /app 

COPY package*.json ./
RUN npm install

COPY . .

# Change to the non-root user
USER onecloud

EXPOSE 8080
CMD [ "node", "index.js" ]
