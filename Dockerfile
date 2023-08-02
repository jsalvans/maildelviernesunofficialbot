FROM denoland/deno:1.35.3

RUN mkdir /app
RUN chown -R deno:deno /app

USER deno
WORKDIR /app

COPY ./deno.json .
COPY ./*.ts .
RUN ls -la

RUN deno cache --config deno.json *.ts
CMD ["run", "--allow-net", "--allow-env", "--allow-read=.", "cron.ts"]