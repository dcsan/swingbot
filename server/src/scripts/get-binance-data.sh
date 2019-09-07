#!/usr/bin/env bash

# refresh binance data
# run from 'server' directory

set -x

datafile=data/binance.1hr.raw.csv

# move out previous version
mv $datafile "$datafile.bak"

echo "getting raw data to ${datafile}"
curl https://www.cryptodatadownload.com/cdd/Binance_BTCUSDT_1h.csv > $datafile

# remove comment line
echo "removing comment line"
tail -n +2 $datafile > data/binance.1hr.step1.csv

mv data/binance.1hr.step1.csv $datafile

echo "ready\n   ${datafile}"

# relod into DB
echo "loading into db with ts-node"
ts-node src/scripts/makePrices.ts

