# Production environment
FROM nginx:alpine

COPY ./build /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d
COPY nginx /etc/nginx

# For local testing
EXPOSE 80

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
# CMD ["nginx", "-g", "daemon off;"]
