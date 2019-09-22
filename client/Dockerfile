# Production environment
FROM nginx:alpine

COPY ./build /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d
COPY nginx /etc/nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]