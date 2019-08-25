# TraderBot

Simple trading TraderBot using nodeJS and typescript

## requirements
node, typescript, mongoDB

others:

    npm i -g ts-node

## config

    cd server
    cp src/config/local.env.example src/config/local.env

edit local.env to add these keys if you want to use realtime market data.
the bot does NOT currently do any trades, but in any case you can create an API key that only has 'read' capability

    BinanceApiKey=YOUR_API_KEY_HERE
    BinanceApiSecret=YOUR_API_SECRET_HERE

## install

    cd server
    npm i


## gettting started
Get some historial BTC-USD price data

    src/scripts/get-binance-data.sh

this will download some CSV data, and then load into a local mongoDB

## running a test bot
using `ts-node` to run typescript at the command line.

    ts-node src/runners/SwingRun.ts

you'll get something like this:

[    SwingRun]  |  market.start	 11400.03
[    SwingRun]  |  market.end	 16199.91
[    SwingRun]  |  profit.total:	 -6780.2

This took some

