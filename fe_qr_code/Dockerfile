# Stage 1: Build the client
FROM node:16.16.0 as builder

WORKDIR /var/www/fe_qr_code

# Copy source code into the image
COPY ./fe_qr_code .

RUN yarn && yarn build

# Stage 2: Setup NGINX
FROM nginx:latest
COPY --from=builder /var/www/fe_qr_code/build /var/www/fe_qr_code/build
COPY --from=builder /var/www/fe_qr_code/nginx.conf /etc/nginx/conf.d/fe_qr_code.conf

EXPOSE 3002

CMD ["nginx", "-g", "daemon off;"]