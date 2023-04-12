FROM denoland/deno:alpine
COPY . /opt/network-metrics
WORKDIR /opt/network-metrics
CMD deno run --allow-read --allow-net --allow-env main.ts
