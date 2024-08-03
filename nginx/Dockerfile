# Собираемся из готового образа nginx:1.23-alpine
FROM nginx:1.23-alpine
# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

RUN apt install certbot python3-certbot-nginx
# Подкидываем наш
COPY ./nginx.conf /etc/nginx/conf.d/