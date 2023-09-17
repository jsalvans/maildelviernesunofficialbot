FROM denoland/deno:alpine-1.36.4

RUN apk add --no-cache tzdata
ENV TZ=Europe/Madrid

RUN echo "0 8 * * 5 /bin/deno -A /app/main.ts" >> /var/spool/cron/crontabs/root

RUN mkdir /app
WORKDIR /app

COPY ./deno.json .
COPY ./*.ts .

RUN date
RUN /bin/deno cache --config deno.json *.ts
CMD ["crond", "-f"]