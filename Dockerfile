# ------------------------------------------------------
# Production Build
# ------------------------------------------------------
FROM nginx:stable-alpine-perl
# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html

COPY ./build .
RUN rm -rf /etc/nginx/conf.d
COPY nginx /etc/nginx
EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
