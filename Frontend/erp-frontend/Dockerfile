# Use Node.js official image to build the Angular app
FROM node:16 AS build

# Set working directory for the build
# WORKDIR /app

# # Copy package.json and install dependencies
# COPY Frontend/erp-frontend/package.json /app/
# COPY Frontend/erp-frontend/package-lock.json /app/
# RUN npm install

# # Copy the rest of the frontend source code
# COPY Frontend/erp-frontend /app/

# RUN npm run build --prod

# # Serve the Angular app using Nginx
# FROM nginx:alpine

# # Copy the built app to Nginx's public folder
# COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html

# # Expose port 80 for the Angular app
# EXPOSE 80

# # Start Nginx to serve the app
# CMD ["nginx", "-g", "daemon off;"]


WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build --prod

CMD ["npx", "http-server", "dist/erp-frontend"]
