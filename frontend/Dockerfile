# --- Stage 1: Build the React App ---
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build it
COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]