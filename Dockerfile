# Stage 1: Install Yarn and dependencies
FROM node:20.10.0 AS build

WORKDIR /app
COPY package*.json ./
#RUN npm install -g yarn  # Install Yarn globally

# Install project dependencies using Yarn
RUN yarn install

# Copy all project files (excluding node_modules)
COPY . .

RUN yarn run build  # Use yarn run build instead of npm run build

# Stage 2: Serve the React application from Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx config file into the container
COPY default.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]