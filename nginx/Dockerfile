# Собираемся из готового образа nginx:1.23-alpine
FROM nginx:1.23-alpine
# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

RUN apk update \
  && apk add certbot

# RUN apk add python3-certbot-nginx

# RUN pip3 install certbot-nginx

# Подкидываем наш
COPY ./nginx.conf /etc/nginx/conf.d/