FROM alpine:3.18.2
COPY ./dist/linux/mdvcron .
CMD ["mdvcron"]