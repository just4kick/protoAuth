# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port on which your Express app is running
EXPOSE 3000

# Install MySQL server
RUN apt-get update && apt-get install -y mysql-server

# Specify environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_DATABASE=your_database_name
ENV MYSQL_USER=your_mysql_user
ENV MYSQL_PASSWORD=your_mysql_password

# Initialize MySQL database and run the app
CMD ["./initialize-and-run.sh"]
