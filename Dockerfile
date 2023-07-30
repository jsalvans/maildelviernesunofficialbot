FROM alpine:3.18.2
COPY ./dist/linux/mdv-cron .
CMD ["mdv-cron"]