require("dotenv").config;
const ccxt = require("ccxt");
const axios = require("axios");

const tick = async () => {
  const { asset, base, spread, allocation } = config;
  const market = `${asset}/${base}`;
  const orders= await binanceClient.fetchOpenOrders(market);
  orders.forEach(async order => {
      await binanceClient.cancelOrder(order.id);



  });
  const results = await Promise.all([
      axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
      axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')

]);
const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd;
const sellPrice = marketPrice *(1+spread);
const buyPrice = marketPrice *(1-spread);
const balance = await binanceClient.fetchBalance();
const assetBalance = balances.free[asset];
const sellVolume = assetBalance * allocation;
const buyVolume = (baseBalance * allocation)/marketPrice;

await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice);
await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice);

console.log(`
New tick for ${market}...\n
Created limit sell for ${sellVolume} at ${sellPrice}
Create limit buy order for ${buyVolume} at ${buyPrice}
`);

};

const run = () => {
  const config = {
    asset: "BTC",
    base: "USDT",
    allocation: 0.1,
    spread: 0.2,
    tickInterval: 2000,
  };
  const binanceClient = new ccxt.binance({
    apiKey: process.env.API_ENV,
    secret: process.env.API_SECRET,
  });

  tick(config, binanceClient);
  setInterval(tick, config.tickIntterval, config, binanceClient);
};
run();
