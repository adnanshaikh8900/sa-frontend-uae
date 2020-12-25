FROM node:12.20.0-stretch as builder

# install and cache app dependencies
COPY package*.json ./
RUN npm install --only=prod --legacy-peer-deps && mkdir /react-frontend && mv ./node_modules ./react-frontend

WORKDIR /react-frontend

COPY . .

RUN npm run build


# ------------------------------------------------------
# Production Build
# ------------------------------------------------------
FROM nginx:stable-alpine-perl
COPY --from=builder /react-frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
