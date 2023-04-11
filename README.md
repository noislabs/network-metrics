# network-metrics

## How to start

1. Copy `config.example.json` to `config.json` and adjust it to your needs
2. Run `deno run --allow-read --allow-net --allow-env main.ts`

## Installation

On a Ubuntu server do:

```sh
sudo apt update && sudo apt upgrade -y && sudo reboot

# Node is restarting ...

sudo apt install -y git htop joe jq unzip

# Install deno
curl -fsSL https://deno.land/x/install/install.sh | sh
echo 'export DENO_INSTALL="$HOME/.deno"' >> ~/.profile
echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> ~/.profile
logout

# Login again
deno --version

git clone https://github.com/noislabs/network-metrics.git \
  && cd network-metrics
```

That's it. Move on with "How to start".

## Upgrading

1. In the bot2 checkout run `git pull`.
2. Check if your `config.json` has all the fields from `config.example.json` and adapt if necessary.

## Run with PM2

Run bot in the background using PM2.

Install Deno as written above, then install NodeJS and PM2:

```sh
wget -O nodejs.deb https://deb.nodesource.com/node_16.x/pool/main/n/nodejs/nodejs_16.17.1-deb-1nodesource1_amd64.deb \
  && sudo dpkg -i nodejs.deb \
  && npm install pm2 -g \
  && cd $HOME/bot2
```

Run bot:

```sh
pm2 start main.ts --interpreter="deno" --interpreter-args="run --allow-read --allow-net"
```

Useful commands:

```sh
#show logs
pm2 logs --lines 100

#restart
pm2 restart main

#restart and show logs
pm2 restart main && pm2 logs --lines 100

#stop bot
pm2 stop main
```
